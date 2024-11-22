import React, { useState, useEffect } from "react";
import { FaFileAlt, FaEdit, FaCheck, FaTimes, FaSave, FaPlus, FaArrowUp, FaArrowDown, FaTrash } from "react-icons/fa";
import { jsPDF } from "jspdf";

const ELEMENT_TYPES = {
  PARAGRAPH: "paragraph",
  HEADING: "heading",
};

const INLINE_TYPES = {
  TEXT: "text",
  INPUT: "input",
  SELECT: "select",
  DATE: "date",
  NUMBER: "number",
};

const InlineElement = ({ type, content, value, onChange }) => {
  switch (type) {
    case INLINE_TYPES.TEXT:
      return <span>{content}</span>;
    case INLINE_TYPES.INPUT:
      return <input type="text" placeholder={content} value={value} onChange={(e) => onChange(e.target.value)} />;
    case INLINE_TYPES.SELECT:
      return (
        <select value={value} onChange={(e) => onChange(e.target.value)}>
          {content.split(',').map((option, index) => (
            <option key={index}>{option.trim()}</option>
          ))}
        </select>
      );
    case INLINE_TYPES.DATE:
      return <input type="date" value={value} onChange={(e) => onChange(e.target.value)} placeholder="YYYY-MM-DD" />;
    case INLINE_TYPES.NUMBER:
      return <input type="number" placeholder={content} value={value} onChange={(e) => onChange(e.target.value)} />;
    default:
      return null;
  }
};

const Button = ({ onClick, children, variant = "primary", size = "medium" }) => {
  const baseStyle = {
    padding: size === "small" ? "4px 8px" : "8px 16px",
    border: "none",
    borderRadius: "5px",
    marginRight: "5px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: size === "small" ? "12px" : "14px"
  };

  const variants = {
    primary: { backgroundColor: "#007bff", color: "white" },
    secondary: { backgroundColor: "#6c757d", color: "white" },
    success: { backgroundColor: "#28a745", color: "white" },
    ghost: { backgroundColor: "transparent", color: "#007bff", border: "1px dashed #007bff" }
  };

  return (
    <button
      onClick={onClick}
      style={{ ...baseStyle, ...variants[variant] }}
    >
      {children}
    </button>
  );
};

const EditableText = ({ value, onSave, placeholder }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  const handleSave = () => {
    onSave(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          placeholder={placeholder}
          style={{ padding: "4px 8px" }}
          autoFocus
        />
        <FaCheck
          onClick={handleSave}
          style={{ cursor: "pointer", color: "#28a745" }}
        />
        <FaTimes
          onClick={handleCancel}
          style={{ cursor: "pointer", color: "#dc3545" }}
        />
      </div>
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <span>{value}</span>
      <FaEdit
        onClick={() => setIsEditing(true)}
        style={{ cursor: "pointer", color: "#6c757d" }}
      />
    </div>
  );
};

const App = () => {
  const [templateName, setTemplateName] = useState("Untitled Template");
  const [sections, setSections] = useState([]);
  const [savedTemplates, setSavedTemplates] = useState([]);
  const [userInputs, setUserInputs] = useState({});

  useEffect(() => {
    const saved = localStorage.getItem('savedTemplates');
    if (saved) {
      setSavedTemplates(JSON.parse(saved));
    }
  }, []);

  const saveTemplate = () => {
    const template = {
      id: Date.now(),
      name: templateName,
      sections: sections,
      lastModified: new Date().toISOString()
    };

    const updatedTemplates = [...savedTemplates, template];
    setSavedTemplates(updatedTemplates);
    localStorage.setItem('savedTemplates', JSON.stringify(updatedTemplates));
  };

  const loadTemplate = (template) => {
    setTemplateName(template.name);
    setSections(template.sections);
  };

  const addSection = () => {
    const newSectionId = Date.now();
    setSections([
      ...sections,
      {
        id: newSectionId,
        name: `Section ${sections.length + 1}`,
        elements: []
      }
    ]);
    setUserInputs(prev => ({ ...prev, [newSectionId]: {} }));
  };

  const updateSectionName = (sectionId, newName) => {
    setSections(sections.map(section => 
      section.id === sectionId ? { ...section, name: newName } : section
    ));
  };

  const addElement = (sectionId, elementType) => {
    const newElementId = Date.now();
    setSections(sections.map(section => {
      if (section.id === sectionId) {
        const newElement = {
          id: newElementId,
          type: elementType,
          content: elementType === ELEMENT_TYPES.PARAGRAPH ? [{ id: Date.now(), type: INLINE_TYPES.TEXT, content: "" }] : "",
          style: {
            fontFamily: "Arial",
            fontSize: elementType === ELEMENT_TYPES.HEADING ? "24px" : "16px",
            fontWeight: elementType === ELEMENT_TYPES.HEADING ? "bold" : "normal"
          }
        };

        return {
          ...section,
          elements: [...section.elements, newElement]
        };
      }
      return section;
    }));
    setUserInputs(prev => ({
      ...prev,
      [sectionId]: { ...prev[sectionId], [newElementId]: {} }
    }));
  };

  const addInlineElement = (sectionId, elementId, inlineType) => {
    let newContent = "";
    switch (inlineType) {
      case INLINE_TYPES.INPUT:
        newContent = prompt("Enter placeholder text for the input:") || "Enter text";
        break;
      case INLINE_TYPES.SELECT:
        newContent = prompt("Enter comma-separated options for the select:") || "Option 1, Option 2";
        break;
      case INLINE_TYPES.NUMBER:
        newContent = prompt("Enter placeholder text for the number input:") || "Enter number";
        break;
      case INLINE_TYPES.DATE:
        newContent = "YYYY-MM-DD";
        break;
      default:
        break;
    }

    const inlineId = Date.now();
    setSections(sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          elements: section.elements.map(element => {
            if (element.id === elementId && element.type === ELEMENT_TYPES.PARAGRAPH) {
              return {
                ...element,
                content: [...element.content, { id: inlineId, type: inlineType, content: newContent }]
              };
            }
            return element;
          })
        };
      }
      return section;
    }));
    setUserInputs(prev => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        [elementId]: {
          ...prev[sectionId]?.[elementId],
          [inlineId]: ""
        }
      }
    }));
  };

  const updateInlineElement = (sectionId, elementId, inlineId, newContent) => {
    setSections(sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          elements: section.elements.map(element => {
            if (element.id === elementId && element.type === ELEMENT_TYPES.PARAGRAPH) {
              const newInlineContent = element.content.map(inline =>
                inline.id === inlineId ? { ...inline, content: newContent } : inline
              );
              return { ...element, content: newInlineContent };
            }
            return element;
          })
        };
      }
      return section;
    }));
  };

  const moveInlineElement = (sectionId, elementId, inlineId, direction) => {
    setSections(sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          elements: section.elements.map(element => {
            if (element.id === elementId && element.type === ELEMENT_TYPES.PARAGRAPH) {
              const index = element.content.findIndex(inline => inline.id === inlineId);
              if (index === -1) return element;
              const newIndex = direction === 'up' ? Math.max(0, index - 1) : Math.min(element.content.length - 1, index + 1);
              const newContent = [...element.content];
              [newContent[index], newContent[newIndex]] = [newContent[newIndex], newContent[index]];
              return { ...element, content: newContent };
            }
            return element;
          })
        };
      }
      return section;
    }));
  };

  const deleteInlineElement = (sectionId, elementId, inlineId) => {
    setSections(sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          elements: section.elements.map(element => {
            if (element.id === elementId && element.type === ELEMENT_TYPES.PARAGRAPH) {
              return {
                ...element,
                content: element.content.filter(inline => inline.id !== inlineId)
              };
            }
            return element;
          })
        };
      }
      return section;
    }));
    setUserInputs(prev => {
      const newUserInputs = { ...prev };
      if (newUserInputs[sectionId]?.[elementId]) {
        delete newUserInputs[sectionId][elementId][inlineId];
      }
      return newUserInputs;
    });
  };

  const replaceInlineElement = (sectionId, elementId, inlineId, newType) => {
    setSections(sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          elements: section.elements.map(element => {
            if (element.id === elementId && element.type === ELEMENT_TYPES.PARAGRAPH) {
              return {
                ...element,
                content: element.content.map(inline => {
                  if (inline.id === inlineId) {
                    let newContent = "";
                    switch (newType) {
                      case INLINE_TYPES.INPUT:
                        newContent = prompt("Enter placeholder text for the input:") || "Enter text";
                        break;
                      case INLINE_TYPES.SELECT:
                        newContent = prompt("Enter comma-separated options for the select:") || "Option 1, Option 2";
                        break;
                      case INLINE_TYPES.NUMBER:
                        newContent = prompt("Enter placeholder text for the number input:") || "Enter number";
                        break;
                      case INLINE_TYPES.DATE:
                        newContent = "YYYY-MM-DD";
                        break;
                      default:
                        newContent = "";
                    }
                    return { ...inline, type: newType, content: newContent };
                  }
                  return inline;
                })
              };
            }
            return element;
          })
        };
      }
      return section;
    }));

    // Reset user input for the replaced element
    setUserInputs(prev => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        [elementId]: {
          ...prev[sectionId]?.[elementId],
          [inlineId]: ""
        }
      }
    }));
  };

  const updateElementContent = (sectionId, elementId, newContent) => {
    setSections(sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          elements: section.elements.map(element => 
            element.id === elementId ? { ...element, content: newContent } : element
          )
        };
      }
      return section;
    }));
  };

  const updateUserInput = (sectionId, elementId, inlineId, value) => {
    setUserInputs(prev => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        [elementId]: {
          ...prev[sectionId]?.[elementId],
          [inlineId]: value
        }
      }
    }));
  };

  const moveSectionUp = (index) => {
    if (index > 0) {
      const newSections = [...sections];
      [newSections[index], newSections[index - 1]] = [newSections[index - 1], newSections[index]];
      setSections(newSections);
    }
  };

  const moveSectionDown = (index) => {
    if (index < sections.length - 1) {
      const newSections = [...sections];
      [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
      setSections(newSections);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    let yPosition = 20;

    doc.setFontSize(24);
    doc.text(templateName, 20, yPosition);
    yPosition += 20;

    sections.forEach(section => {
      doc.setFontSize(18);
      doc.text(section.name, 20, yPosition);
      yPosition += 15;

      section.elements.forEach(element => {
        doc.setFontSize(element.type === ELEMENT_TYPES.HEADING ? 16 : 12);
        doc.setFont(element.style.fontFamily, element.style.fontWeight);
        
        if (element.type === ELEMENT_TYPES.PARAGRAPH) {
          let paragraphText = "";
          element.content.forEach(inlineElement => {
            const userInput = userInputs[section.id]?.[element.id]?.[inlineElement.id] || '';
            switch (inlineElement.type) {
              case INLINE_TYPES.TEXT:
                paragraphText += inlineElement.content;
                break;
              case INLINE_TYPES.INPUT:
                paragraphText += `[Input: ${inlineElement.content}]`;
                break;
              case INLINE_TYPES.SELECT:
                paragraphText += `[Select: ${inlineElement.content}]`;
                break;
              case INLINE_TYPES.DATE:
                paragraphText += `[Date]`;
                break;
                case INLINE_TYPES.NUMBER:
                  paragraphText += userInput || `[${inlineElement.type}: ${inlineElement.content}]`;
                  break;
                default:
                  break;
              }
            });
            const lines = doc.splitTextToSize(paragraphText, 170);
            doc.text(lines, 20, yPosition);
            yPosition += 10 * lines.length;
          } else {
            doc.text(element.content || '[Empty]', 20, yPosition);
            yPosition += 10;
          }
        });
        yPosition += 10;
      });
  
      doc.save(`${templateName}.pdf`);
    };
  
    return (
      <div style={{ display: "flex", padding: "20px", gap: "20px" }}>
        <div style={{ flex: 1, maxWidth: "600px" }}>
          <div style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <EditableText
              value={templateName}
              onSave={setTemplateName}
              placeholder="Enter template name"
            />
            <div>
              <Button onClick={saveTemplate} variant="success">
                <FaSave /> Save Template
              </Button>
            </div>
          </div>
  
          {/* Saved Templates List */}
          <div style={{ marginBottom: "20px" }}>
            <h3>Saved Templates</h3>
            <div style={{ maxHeight: "200px", overflowY: "auto" }}>
              {savedTemplates.map(template => (
                <div 
                  key={template.id}
                  style={{
                    padding: "10px",
                    border: "1px solid #dee2e6",
                    borderRadius: "5px",
                    marginBottom: "5px",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                  onClick={() => loadTemplate(template)}
                >
                  <div>
                    <div>{template.name}</div>
                    <div style={{ fontSize: "12px", color: "#6c757d" }}>
                      Last modified: {new Date(template.lastModified).toLocaleDateString()}
                    </div>
                  </div>
                  <Button size="small" variant="secondary">Load</Button>
                </div>
              ))}
            </div>
          </div>
  
          <Button onClick={addSection}>Add Section</Button>
          <Button onClick={generatePDF} variant="success">
            <FaFileAlt /> Generate PDF
          </Button>
  
          <div style={{ marginTop: "20px" }}>
            {sections.map((section, sectionIndex) => (
              <div
                key={section.id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "20px",
                  marginBottom: "20px",
                  backgroundColor: "#f8f9fa"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <EditableText
                    value={section.name}
                    onSave={(newName) => updateSectionName(section.id, newName)}
                    placeholder="Enter section name"
                  />
                  <div>
                    <Button onClick={() => moveSectionUp(sectionIndex)} size="small" variant="secondary">
                      Move Up
                    </Button>
                    <Button onClick={() => moveSectionDown(sectionIndex)} size="small" variant="secondary">
                      Move Down
                    </Button>
                  </div>
                </div>
                
                <div style={{ marginBottom: "10px" }}>
                  <Button onClick={() => addElement(section.id, ELEMENT_TYPES.PARAGRAPH)}>Add Paragraph</Button>
                  <Button onClick={() => addElement(section.id, ELEMENT_TYPES.HEADING)}>Add Heading</Button>
                </div>
  
                {section.elements.map((element) => (
                  <div key={element.id} style={{ marginBottom: "10px" }}>
                    {element.type === ELEMENT_TYPES.PARAGRAPH && (
                      <div>
                        {element.content.map((inlineElement, index) => (
                          <div key={inlineElement.id} style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
                            <span style={{ marginRight: "5px" }}>
                              {inlineElement.type === INLINE_TYPES.TEXT ? (
                                <input
                                  type="text"
                                  value={inlineElement.content}
                                  onChange={(e) => updateInlineElement(section.id, element.id, inlineElement.id, e.target.value)}
                                  style={{ width: "auto", display: "inline-block" }}
                                />
                              ) : (
                                <span style={{ color: "blue", fontWeight: "bold" }}>[{inlineElement.type.toUpperCase()}]</span>
                              )}
                            </span>
                            <Button size="small" onClick={() => moveInlineElement(section.id, element.id, inlineElement.id, 'up')} disabled={index === 0}>
                              <FaArrowUp />
                            </Button>
                            <Button size="small" onClick={() => moveInlineElement(section.id, element.id, inlineElement.id, 'down')} disabled={index === element.content.length - 1}>
                              <FaArrowDown />
                            </Button>
                            <Button size="small" variant="secondary" onClick={() => deleteInlineElement(section.id, element.id, inlineElement.id)}>
                              <FaTrash />
                            </Button>
                            <select
                              onChange={(e) => replaceInlineElement(section.id, element.id, inlineElement.id, e.target.value)}
                              value={inlineElement.type}
                              style={{ marginLeft: "5px" }}
                            >
                              <option value={INLINE_TYPES.TEXT}>Text</option>
                              <option value={INLINE_TYPES.INPUT}>Input</option>
                              <option value={INLINE_TYPES.SELECT}>Select</option>
                              <option value={INLINE_TYPES.DATE}>Date</option>
                              <option value={INLINE_TYPES.NUMBER}>Number</option>
                            </select>
                          </div>
                        ))}
                        <div style={{ marginTop: "5px" }}>
                          <Button size="small" onClick={() => addInlineElement(section.id, element.id, INLINE_TYPES.TEXT)}>Add Text</Button>
                          <Button size="small" onClick={() => addInlineElement(section.id, element.id, INLINE_TYPES.INPUT)}>Add Input</Button>
                          <Button size="small" onClick={() => addInlineElement(section.id, element.id, INLINE_TYPES.SELECT)}>Add Select</Button>
                          <Button size="small" onClick={() => addInlineElement(section.id, element.id, INLINE_TYPES.DATE)}>Add Date</Button>
                          <Button size="small" onClick={() => addInlineElement(section.id, element.id, INLINE_TYPES.NUMBER)}>Add Number</Button>
                        </div>
                      </div>
                    )}
                    {element.type === ELEMENT_TYPES.HEADING && (
                      <input
                        type="text"
                        value={element.content}
                        onChange={(e) => updateElementContent(section.id, element.id, e.target.value)}
                        placeholder="Enter heading"
                        style={{
                          width: "100%",
                          padding: "8px",
                          border: "1px solid #ddd",
                          borderRadius: "4px",
                          ...element.style
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
  
        {/* A4 Preview Section */}
        <div
          style={{
            flex: 1,
            position: "sticky",
            top: "20px",
            height: "calc(100vh - 40px)"
          }}
        >
          <div
            style={{
              width: "210mm",
              height: "297mm",
              padding: "20mm",
              backgroundColor: "white",
              boxShadow: "0 0 10px rgba(0,0,0,0.1)",
              overflow: "auto",
              border: "1px solid #ddd"
            }}
          >
            <h1 style={{ marginBottom: "20px", fontSize: "24px" }}>{templateName}</h1>
            {sections.map((section) => (
              <div key={section.id} style={{ marginBottom: "20px" }}>
                <h2 style={{ fontSize: "20px", marginBottom: "10px" }}>{section.name}</h2>
                {section.elements.map((element) => (
                  <div
                    key={element.id}
                    style={{
                      marginBottom: "10px",
                      ...element.style
                    }}
                  >
                    {element.type === ELEMENT_TYPES.PARAGRAPH ? (
                      <p>
                        {element.content.map((inlineElement) => (
                          <InlineElement
                            key={inlineElement.id}
                            type={inlineElement.type}
                            content={inlineElement.content}
                            value={userInputs[section.id]?.[element.id]?.[inlineElement.id] || ''}
                            onChange={(value) => updateUserInput(section.id, element.id, inlineElement.id, value)}
                          />
                        ))}
                      </p>
                    ) : (
                      <h3>{element.content || <span style={{ color: "#999" }}>[Empty]</span>}</h3>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  export default App;