import React, { useState, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import Draggable from 'react-draggable';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import './App.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
function SignatureCanvas({ onSave, onClose }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.lineWidth = 2;
    context.strokeStyle = '#000000';
  }, []);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.beginPath();
    context.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    context.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    const signatureDataUrl = canvas.toDataURL();
    onSave(signatureDataUrl);
  };

  return (
    <div className="signature-canvas-container">
      <canvas
        ref={canvasRef}
        width={400}
        height={200}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
      />
      <div>
        <button onClick={handleSave}>Save Signature</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

function PDFViewer() {
  const [pdfFile, setPdfFile] = useState();
  console.log("pdf",typeof pdfFile)
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageScale, setPageScale] = useState(1);
  const [textBoxes, setTextBoxes] = useState([]);
  const [showSignatureCanvas, setShowSignatureCanvas] = useState(false);
  const [selectedBoxId, setSelectedBoxId] = useState(null);
  const containerRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      const fileURL = URL.createObjectURL(file);
      setPdfFile(fileURL);
      setPageNumber(1);
    } else {
      alert('Please select a valid PDF file.');
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handlePrint = async () => {
    if (pdfFile) {
      const response = await fetch(pdfFile);
      const pdfBytes = await response.arrayBuffer();
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const pages = pdfDoc.getPages();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

      for (const box of textBoxes) {
        const page = pages[box.page - 1];
        if (box.type === 'signature') {
          const signatureImage = await pdfDoc.embedPng(box.signatureDataUrl);
          page.drawImage(signatureImage, {
            x: box.x,
            y: page.getHeight() - box.y - box.height,
            width: box.width,
            height: box.height,
          });
        } else {
          page.drawText(box.text, {
            x: box.x,
            y: page.getHeight() - box.y - box.height,
            size: 12,
            font: font,
            color: rgb(0, 0, 0),
          });
        }
      }

      const modifiedPdfBytes = await pdfDoc.save();
      const blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      const printWindow = window.open(url);
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  };

  const changePage = (offset) => {
    setPageNumber(prevPageNumber => Math.min(Math.max(prevPageNumber + offset, 1), numPages));
  };

  const addTextBox = () => {
    const newBox = {
      id: Date.now(),
      text: '',
      x: 50,
      y: 50,
      width: 200,
      height: 100,
      page: pageNumber
    };
    setTextBoxes(prevBoxes => [...prevBoxes, newBox]);
  };

  const updateTextBox = (id, newProps) => {
    setTextBoxes(prevBoxes => prevBoxes.map(box => 
      box.id === id ? { ...box, ...newProps } : box
    ));
  };

  const handleDrag = (id, e, data) => {
    const { x, y } = data;
    const box = textBoxes.find(box => box.id === id);
    console.log(`Box ${id} position: x=${x}, y=${y}, page=${box.page}`);
  };

  const onDragStop = (id, e, data) => {
    const { x, y } = data;
    const box = textBoxes.find(box => box.id === id);
    console.log(`Box ${id} final position: x=${x}, y=${y}, page=${box.page}`);
    updateTextBox(id, { x, y });
  };

  const handleAddSignature = () => {
    if (selectedBoxId) {
      setShowSignatureCanvas(true);
    } else {
      alert('Please select a box first to add a signature.');
    }
  };

  const handleSaveSignature = (signatureDataUrl) => {
    setShowSignatureCanvas(false);
    if (selectedBoxId) {
      updateTextBox(selectedBoxId, { type: 'signature', signatureDataUrl });
    }
  };

  const handleCloseSignatureCanvas = () => {
    setShowSignatureCanvas(false);
  };

  const handleBoxClick = (id) => {
    setSelectedBoxId(id);
  };

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const a4Width = 595.276; // in points
        const scale = containerWidth / a4Width;
        setPageScale(scale);
      }
    };

    window.addEventListener('resize', updateScale);
    updateScale();

    return () => window.removeEventListener('resize', updateScale);
  }, []);

  return (
    <div className="pdf-viewer">
      <input type="file" accept=".pdf" onChange={handleFileChange} />
      {pdfFile && (
        <>
          <button onClick={handlePrint}>Print PDF</button>
          <button onClick={addTextBox}>Add Box</button>
          <button onClick={handleAddSignature}>Add Signature</button>
        </>
      )}
      <div className="pdf-container" ref={containerRef}>
        {pdfFile && (
          <Document
            file={pdfFile}
            onLoadSuccess={onDocumentLoadSuccess}
            options={{
              cMapUrl: 'https://unpkg.com/pdfjs-dist@2.9.359/cmaps/',
              cMapPacked: true,
            }}
          >
            <Page
              pageNumber={pageNumber}
              scale={pageScale}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          </Document>
        )}
        <div className="text-boxes-layer">
          {textBoxes.filter(box => box.page === pageNumber).map(box => (
            <Draggable
              key={box.id}
              defaultPosition={{x: box.x, y: box.y}}
              onDrag={(e, data) => handleDrag(box.id, e, data)}
              onStop={(e, data) => onDragStop(box.id, e, data)}
              bounds="parent"
            >
              <div
                onClick={() => handleBoxClick(box.id)}
                style={{
                  position: 'absolute',
                  width: box.width,
                  height: box.height,
                  border: '1px solid black',
                  background: 'rgba(255, 255, 255, 0.7)',
                  cursor: 'pointer',
                  outline: box.id === selectedBoxId ? '2px solid blue' : 'none',
                }}
              >
                {box.type === 'signature' ? (
                  <img src={box.signatureDataUrl} alt="Signature" style={{ width: '100%', height: '100%' }} />
                ) : (
                  <textarea
                    value={box.text}
                    onChange={(e) => updateTextBox(box.id, { text: e.target.value })}
                    style={{
                      width: '100%',
                      height: '100%',
                      border: 'none',
                      background: 'transparent',
                      resize: 'none',
                    }}
                  />
                )}
              </div>
            </Draggable>
          ))}
        </div>
      </div>
      {pdfFile && (
        <div className="pagination">
          <button onClick={() => changePage(-1)} disabled={pageNumber <= 1}>
            Previous
          </button>
          <span>Page {pageNumber} of {numPages}</span>
          <button onClick={() => changePage(1)} disabled={pageNumber >= numPages}>
            Next
          </button>
        </div>
      )}
      {showSignatureCanvas && (
        <div className="signature-modal">
          <SignatureCanvas onSave={handleSaveSignature} onClose={handleCloseSignatureCanvas} />
        </div>
      )}
    </div>
  );
}

export default PDFViewer;


