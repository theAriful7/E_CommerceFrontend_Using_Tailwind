import { Injectable } from '@angular/core';
import { FileData } from '../models/file-data.model';

@Injectable({
  providedIn: 'root'
})
export class FileDataService {
 
  getProductImage(images: FileData[]): string {
    if (!images || images.length === 0) {
      return '/assets/images/default-product.png';
    }

    // Get primary image first, then first image by sort order
    const primaryImage = images.find(img => img.isPrimary);
    if (primaryImage) {
      return primaryImage.filePath;
    }

    // Get image with lowest sort order
    const sortedImages = [...images].sort((a, b) => a.sortOrder - b.sortOrder);
    return sortedImages[0].filePath;
  }

  getAllProductImages(images: FileData[]): string[] {
    if (!images || images.length === 0) {
      return ['/assets/images/default-product.png'];
    }

    return images
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map(img => img.filePath);
  }
}
