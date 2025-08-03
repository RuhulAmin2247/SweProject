import React, { useState } from 'react';
import './AddSeatForm.css';

const AddSeatForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    type: 'Mess',
    location: '',
    price: '',
    description: '',
    amenities: [],
    contact: '',
    images: [],
    imageFiles: [],
    occupancyType: 'Single',
    gender: 'Boys',
    availability: 'Available'
  });

  const availableAmenities = [
    'WiFi', 'AC', 'Laundry', '24/7 Security', 'Furnished', 
    'Kitchen Access', 'Study Room', 'Common Room', 'Library', 
    'Medical Facility', 'Generator', 'Parking','Single', 'Double', 'Triple', 'Quad'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const maxFiles = 4;
    
    if (formData.imageFiles.length + files.length > maxFiles) {
      alert(`You can upload maximum ${maxFiles} images`);
      return;
    }

    // Create preview URLs for the new files
    const newImagePreviews = files.map(file => URL.createObjectURL(file));
    
    setFormData({
      ...formData,
      imageFiles: [...formData.imageFiles, ...files],
      images: [...formData.images, ...newImagePreviews]
    });
    
    // Clear the file input
    e.target.value = '';
  };

  const removeImage = (index) => {
    const updatedImageFiles = formData.imageFiles.filter((_, i) => i !== index);
    const updatedImages = formData.images.filter((_, i) => i !== index);
    
    // Revoke the object URL to free memory
    URL.revokeObjectURL(formData.images[index]);
    
    setFormData({
      ...formData,
      imageFiles: updatedImageFiles,
      images: updatedImages
    });
  };

  const handleAmenityChange = (amenity) => {
    const updatedAmenities = formData.amenities.includes(amenity)
      ? formData.amenities.filter(a => a !== amenity)
      : [...formData.amenities, amenity];
    
    setFormData({ ...formData, amenities: updatedAmenities });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title && formData.location && formData.price && formData.contact) {
      // For demo purposes, we'll use the preview URLs
      // In a real app, you would upload files to a server first
      const submissionData = {
        ...formData,
        price: parseInt(formData.price),
        images: formData.images.length > 0 ? formData.images : ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400'],
        image: formData.images.length > 0 ? formData.images[0] : 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400' // For backward compatibility
      };
      onSubmit(submissionData);
    }
  };

  return (
    <div className="add-seat-form">
      <div className="form-container">
        <div className="form-header">
          <h2>Add Your Mess/House</h2>
          <button className="close-btn" onClick={onCancel}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="seat-form">
          <div className="form-group">
            <label htmlFor="title">Property Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Modern Mess - Shaheb Bazar"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="type">Type *</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
              >
                <option value="Mess">Mess</option>
                <option value="House">House</option>
              </select>
            </div>

              
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="gender">For Gender *</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                required
              >
                <option value="Boys">Boys</option>
                <option value="Girls">Girls</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="price">Monthly Rent (৳) *</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="e.g., 4500"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="location">Location *</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="e.g., Shaheb Bazar, Rajshahi"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your property, facilities, and what makes it special..."
              rows="4"
            />
          </div>

          <div className="form-group">
            <label htmlFor="contact">Contact Number *</label>
            <input
              type="tel"
              id="contact"
              name="contact"
              value={formData.contact}
              onChange={handleInputChange}
              placeholder="e.g., +880 1711-123456"
              required
            />
          </div>

          <div className="form-group">
            <label>Property Images (Up to 4 images)</label>
            <div className="images-section">
              {/* File Upload Button */}
              <div className="file-upload-section">
                <input
                  type="file"
                  id="imageUpload"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="file-input"
                  style={{ display: 'none' }}
                />
                <label htmlFor="imageUpload" className="upload-btn">
                  📷 Choose Images from Gallery
                </label>
                <p className="upload-help-text">
                  Select up to 4 images from your device (JPG, PNG, GIF)
                </p>
              </div>

              {/* Image Previews */}
              {formData.images.length > 0 && (
                <div className="image-previews">
                  <h4>Selected Images:</h4>
                  <div className="preview-grid">
                    {formData.images.map((image, index) => (
                      <div key={index} className="image-preview">
                        <img src={image} alt={`Preview ${index + 1}`} />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="remove-preview-btn"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Manual URL Input (Alternative option) */}
              <div className="url-input-section">
                <details>
                  <summary className="url-toggle">Or add image URLs manually</summary>
                  <div className="url-inputs">
                    {formData.images.length === 0 && (
                      <>
                        <input
                          type="url"
                          placeholder="Image URL (e.g., https://example.com/image.jpg)"
                          className="image-input"
                          onBlur={(e) => {
                            if (e.target.value.trim()) {
                              setFormData({
                                ...formData,
                                images: [e.target.value.trim()]
                              });
                              e.target.value = '';
                            }
                          }}
                        />
                        <p className="image-help-text">
                          📝 Tip: You can also paste image URLs from the web
                        </p>
                      </>
                    )}
                  </div>
                </details>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Amenities</label>
            <div className="amenities-checkboxes">
              {availableAmenities.map((amenity) => (
                <label key={amenity} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.amenities.includes(amenity)}
                    onChange={() => handleAmenityChange(amenity)}
                  />
                  <span className="checkmark"></span>
                  {amenity}
                </label>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              Add Property
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSeatForm;
