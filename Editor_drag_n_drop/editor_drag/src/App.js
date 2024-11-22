import { useState, useRef, useEffect } from 'react';
import {
  FiDownload,
  FiUpload,
  FiFile,
  FiFileText,
  FiTrash2,
  FiPlus,
  FiSave,
  FiX,
} from 'react-icons/fi';
import "./App.css";

// Component Types Definition
const COMPONENT_TYPES = {
  TEXT: 'text',
  INPUT: 'input',
  TEXTAREA: 'textarea',
  IMAGE: 'image',
  TOGGLE: 'toggle',
  SECTION: 'section'
};

// Default Templates
const DEFAULT_TEMPLATES = [
  {
    id: 'professional',
    name: 'Professional',
    description: 'Clean and professional template',
    components: [
      { id: 'name', type: 'text', value: '[Your Name]', style: 'text-3xl font-bold mb-2' },
      { id: 'title', type: 'text', value: '[Professional Title]', style: 'text-xl text-gray-600 mb-4' },
      { id: 'contact', type: 'section', label: 'Contact Details', style: 'mb-6', components: [
        { id: 'email', type: 'input', value: 'email@example.com', label: 'Email' },
        { id: 'phone', type: 'input', value: '+1234567890', label: 'Phone' }
      ]},
      { id: 'summary', type: 'textarea', value: 'Professional summary...', label: 'Summary', style: 'mb-6' }
    ]
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Modern and creative design',
    components: [
      { id: 'header', type: 'section', style: 'text-center mb-8', components: [
        { id: 'name', type: 'text', value: '[Creative Professional]', style: 'text-4xl font-bold mb-2' },
        { id: 'title', type: 'text', value: '[Creative Title]', style: 'text-2xl text-gray-600' }
      ]},
      { id: 'profile-image', type: 'image', label: 'Profile Image', style: 'mb-6 mx-auto max-w-xs' }
    ]
  }
];

// Component-specific Props and Handlers
const ComponentProps = {
  Text: ({ value, onChange, style, placeholder = 'Enter text' }) => ({
    value,
    onChange: e => onChange(e.target.value),
    className: `w-full resize-none ${style}`,
    placeholder
  }),

  Input: ({ value, onChange, label, style, placeholder = 'Enter value' }) => ({
    value,
    onChange: e => onChange(e.target.value),
    className: `w-full ${style}`,
    placeholder,
    label
  }),

  Image: ({ value, onChange, label, style }) => ({
    src: value,
    onChange: file => {
      const reader = new FileReader();
      reader.onload = e => onChange(e.target.result);
      reader.readAsDataURL(file);
    },
    className: `max-w-full h-auto ${style}`,
    label
  }),

  Toggle: ({ value, onChange, label, style }) => ({
    checked: value,
    onCheckedChange: onChange,
    className: style,
    label
  })
};

// Individual Components
const ComponentRenderers = {
  Text: ({ props }) => (
    <textarea {...ComponentProps.Text(props)} />
  ),

  Input: ({ props }) => (
    <div>
      {props.label && (
        <label className="block text-sm font-medium mb-1">{props.label}</label>
      )}
      <input {...ComponentProps.Input(props)} />
    </div>
  ),

  Image: ({ props }) => (
    <div>
      {props.label && (
        <label className="block text-sm font-medium mb-1">{props.label}</label>
      )}
      <div className="relative">
        <input
          type="file"
          accept="image/*"
          onChange={e => e.target.files[0] && props.onChange(e.target.files[0])}
          className="hidden"
          id={`image-${props.id}`}
        />
        {props.src ? (
          <img src={props.src} alt={props.label || 'Resume image'} className={props.className} />
        ) : (
          <button
            onClick={() => document.getElementById(`image-${props.id}`).click()}
            className={props.className}
          >
            Upload Image
          </button>
        )}
      </div>
    </div>
  ),

  Toggle: ({ props }) => (
    <div className="flex items-center space-x-2">
      <input
        type="checkbox"
        {...ComponentProps.Toggle(props)}
      />
      {props.label && (
        <label className="text-sm">{props.label}</label>
      )}
    </div>
  ),

  Section: ({ props, children }) => (
    <div className={`${props.style} space-y-4`}>
      {props.label && (
        <h3 className="text-lg font-semibold">{props.label}</h3>
      )}
      {children}
    </div>
  )
};

// Modal Components
const TemplateModal = ({ templates, onSelect, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Choose Template</h2>
        <button onClick={onClose}>
          <FiX  />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {templates.map(template => (
          <div
            key={template.id}
            className="border rounded-lg p-4 cursor-pointer hover:border-blue-500"
            onClick={() => onSelect(template)}
          >
            <h3 className="font-semibold text-lg mb-2">{template.name}</h3>
            <p className="text-gray-600 mb-4">{template.description}</p>
            <button className="w-full border">
              Use Template
            </button>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const SaveTemplateModal = ({ onSave, onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Save Template</h2>
          <button onClick={onClose}>
            <FiX />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Template Name</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Enter template name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Enter template description"
            />
          </div>
          <button
            onClick={() => onSave({ name, description })}
            disabled={!name}
          >
            Save Template
          </button>
        </div>
      </div>
    </div>
  );
};

// Toolbar Component
const Toolbar = ({ onAddComponent, onImport, onExport, onOpenTemplates, onSaveTemplate }) => (
  <div className="w-64 bg-gray-100 p-4 border-r">
    <h2 className="text-lg font-semibold mb-4">Components</h2>
    {Object.entries(COMPONENT_TYPES).map(([key, value]) => (
      <button
        key={key}
        className="w-full mb-2 border"
        onClick={() => onAddComponent(value)}
      >
        <FiPlus  />
        Add {key.toLowerCase()}
      </button>
    ))}

    <div className="mt-8 space-y-2">
      <h3 className="text-lg font-semibold mb-2">Templates</h3>
      <button className="w-full border" onClick={onOpenTemplates}>
        <FiFile  />
        Load Template
      </button>
      <button className="w-full border" onClick={onSaveTemplate}>
        <FiSave  />
        Save as Template
      </button>

      <h3 className="text-lg font-semibold mt-4 mb-2">Import/Export</h3>
      <input
        type="file"
        accept=".json"
        onChange={e => {
          const file = e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = event => {
              onImport(JSON.parse(event.target.result));
            };
            reader.readAsText(file);
          }
        }}
        className="hidden"
        id="import-input"
      />
      <button className="w-full border" onClick={() => document.getElementById('import-input').click()}>
        <FiUpload className="w-4 h-4 mr-2" />
        Import
      </button>
      <button className="w-full border" onClick={onExport}>
        <FiDownload  />
        Export
      </button>
    </div>
  </div>
);

// Resume Builder Main Component
export default function App() {
  const [components, setComponents] = useState([]);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showSaveTemplateModal, setShowSaveTemplateModal] = useState(false);

  // Load Template
  const handleLoadTemplate = template => {
    setComponents(template.components);
    setShowTemplateModal(false);
  };

  // Add Component
  const handleAddComponent = type => {
    setComponents([...components, { id: Date.now(), type, value: '' }]);
  };

  // Update Component
  const handleUpdateComponent = (id, updatedProps) => {
    setComponents(components.map(c => (c.id === id ? { ...c, ...updatedProps } : c)));
  };

  // Remove Component
  const handleRemoveComponent = id => {
    setComponents(components.filter(c => c.id !== id));
  };

  // Export Resume
  const handleExport = () => {
    const json = JSON.stringify(components);
    const blob = new Blob([json], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'resume.json';
    link.click();
  };

  // Import Resume
  const handleImport = importedComponents => {
    setComponents(importedComponents);
  };

  // Save Template
  const handleSaveTemplate = templateData => {
    const newTemplate = {
      id: Date.now(),
      name: templateData.name,
      description: templateData.description,
      components
    };
    // Add logic to save template to database or localStorage
    console.log('Template saved:', newTemplate);
    setShowSaveTemplateModal(false);
  };

  return (
    <div className="flex h-screen">
      {/* Toolbar */}
      <Toolbar
        onAddComponent={handleAddComponent}
        onExport={handleExport}
        onImport={handleImport}
        onOpenTemplates={() => setShowTemplateModal(true)}
        onSaveTemplate={() => setShowSaveTemplateModal(true)}
      />

      {/* Resume Preview */}
      <div className="flex-1 p-8 overflow-y-auto">
        {components.map((component, index) => {
          const Renderer = ComponentRenderers[component.type];
          return (
            <div key={component.id} className="mb-4 border p-4">
              {Renderer ? (
                <Renderer
                  props={{
                    ...component,
                    onChange: value => handleUpdateComponent(component.id, { value })
                  }}
                />
              ) : (
                <p>Unknown component type: {component.type}</p>
              )}
              <button
                onClick={() => handleRemoveComponent(component.id)}
                className="text-red-500"
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Modals */}
      {showTemplateModal && (
        <TemplateModal
          templates={DEFAULT_TEMPLATES}
          onSelect={handleLoadTemplate}
          onClose={() => setShowTemplateModal(false)}
        />
      )}
      {showSaveTemplateModal && (
        <SaveTemplateModal
          onSave={handleSaveTemplate}
          onClose={() => setShowSaveTemplateModal(false)}
        />
      )}
    </div>
  );
}
