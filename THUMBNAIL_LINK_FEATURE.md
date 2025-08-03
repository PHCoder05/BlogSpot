# Thumbnail Link Feature

## Overview
This feature allows users to add blog post thumbnails via image URLs in addition to file uploads.

## Features Added

### CreateBlog Component
- **Tab-based interface**: Users can switch between "Upload File" and "Image URL" tabs
- **URL validation**: Basic URL format validation and image extension checking
- **Preview functionality**: Shows thumbnail preview for both uploaded files and image URLs
- **Error handling**: Displays appropriate error messages for invalid URLs or images
- **State management**: Properly manages upload method state and clears conflicting data

### EditBlog Component
- **Radio button interface**: Users can choose between file upload and image link options
- **Existing thumbnail preservation**: Maintains current thumbnail if no new one is provided
- **URL validation**: Same validation as CreateBlog component
- **Preview functionality**: Shows thumbnail preview for both uploaded files and image URLs

## Technical Implementation

### State Management
- `uploadMethod`: Tracks whether user is uploading file or using URL ('file' or 'link')
- `imageUrl`: Stores the image URL input value
- `thumbnailLink`: Used in EditBlog for the image URL (existing implementation)

### Validation Functions
- **URL format validation**: Uses `new URL()` to validate URL syntax
- **Image extension checking**: Validates common image extensions (.jpg, .jpeg, .png, .gif, .webp, .svg)
- **Data URL support**: Supports data URLs for base64 encoded images
- **Warning system**: Warns users if URL doesn't appear to be an image

### Error Handling
- Invalid URL format
- Non-image URLs (with warnings)
- Image loading failures
- File size and type validation for uploads

## Usage

### Creating a New Blog Post
1. Navigate to the Create Blog page
2. In the "Blog Thumbnail" section, choose between:
   - **Upload File**: Click the upload area to select an image file
   - **Image URL**: Enter a valid image URL
3. The thumbnail will be previewed automatically
4. Submit the form to create the blog post

### Editing an Existing Blog Post
1. Navigate to the Edit Blog page
2. In the "Blog Thumbnail" section, choose between:
   - **Upload Image**: Upload a new image file
   - **Use Image Link**: Enter a new image URL
3. The current thumbnail is preserved if no new one is provided
4. Submit the form to update the blog post

## Supported Image Formats
- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)
- WebP (.webp)
- SVG (.svg)
- Data URLs (base64 encoded images)

## File Size Limits
- **CreateBlog**: 10MB maximum for file uploads
- **EditBlog**: 5MB maximum for file uploads
- **URL images**: No size limit (depends on the source)

## Error Messages
- "Please enter an image URL" - When URL field is empty
- "Please enter a valid URL" - When URL format is invalid
- "Invalid image URL" - When image fails to load
- "URL might not be an image" - Warning when URL doesn't have image extension
- "Image size should be less than XMB" - When uploaded file is too large
- "Please select a valid image file" - When uploaded file is not an image 