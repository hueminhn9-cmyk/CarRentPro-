import { VehicleRepository } from '../repositories/vehicle.repository.js';
import { AuditService } from './audit.service.js';
import { NotFoundError, ConflictError } from '../utils/errors.js';
import { prisma } from '../config/prisma.js';

export class VehicleService {
  // Categories
  static async getAllCategories() {
    return VehicleRepository.findAllCategories();
  }

  static async getCategoryById(id: bigint) {
    const category = await VehicleRepository.findCategoryById(id);
    if (!category) {
      throw new NotFoundError('Không tìm thấy danh mục xe');
    }
    return category;
  }

  static async createCategory(data: { name: string; description?: string }) {
    const existing = await VehicleRepository.findAllCategories();
    if (existing.some((c) => c.name.toLowerCase() === data.name.toLowerCase())) {
      throw new ConflictError('Danh mục xe này đã tồn tại');
    }
    return VehicleRepository.createCategory(data);
  }

  static async updateCategory(id: bigint, data: { name?: string; description?: string }) {
    const category = await VehicleRepository.findCategoryById(id);
    if (!category) {
      throw new NotFoundError('Không tìm thấy danh mục xe');
    }
    return VehicleRepository.updateCategory(id, data);
  }

  static async deleteCategory(id: bigint) {
    const category = await VehicleRepository.findCategoryById(id);
    if (!category) {
      throw new NotFoundError('Không tìm thấy danh mục xe');
    }
    return VehicleRepository.deleteCategory(id);
  }

  // Vehicles
  static async getVehicleById(id: bigint) {
    const vehicle = await VehicleRepository.findById(id);
    if (!vehicle) {
      throw new NotFoundError('Không tìm thấy xe');
    }
    const media = await prisma.media_files.findFirst({
      where: {
        entity_type: 'VEHICLE',
        entity_id: vehicle.id,
        is_primary: true
      }
    });
    return {
      ...vehicle,
      image: media ? media.file_path : 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=600&auto=format&fit=crop&q=60'
    };
  }

  static async getAllVehicles(options: any) {
    const { vehicles, total } = await VehicleRepository.findAll(options);
    
    // Batch query primary images for all returned vehicles
    const mediaFiles = await prisma.media_files.findMany({
      where: {
        entity_type: 'VEHICLE',
        entity_id: { in: vehicles.map(v => v.id) },
        is_primary: true
      }
    });

    const vehiclesWithImages = vehicles.map(v => {
      const media = mediaFiles.find(m => m.entity_id === v.id);
      return {
        ...v,
        image: media ? media.file_path : 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=600&auto=format&fit=crop&q=60'
      };
    });

    return { vehicles: vehiclesWithImages, total };
  }

  static async createVehicle(data: any) {
    const { image, ...vehicleData } = data;
    const existingCode = await VehicleRepository.findByCode(vehicleData.code);
    if (existingCode) {
      throw new ConflictError('Mã xe đã được sử dụng');
    }
    const vehicle = await VehicleRepository.create(vehicleData);
    if (image) {
      await prisma.media_files.create({
        data: {
          entity_type: 'VEHICLE',
          entity_id: vehicle.id,
          original_name: 'car.jpg',
          stored_name: 'car.jpg',
          file_path: image,
          is_primary: true,
          storage_provider: 'LOCAL'
        }
      });
    }

    await AuditService.log({
      action: 'CREATE_VEHICLE',
      entityName: 'vehicles',
      entityId: vehicle.id,
      newValues: vehicleData,
    });

    return {
      ...vehicle,
      image: image || 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=600&auto=format&fit=crop&q=60'
    };
  }

  static async updateVehicle(id: bigint, data: any) {
    const { image, ...vehicleData } = data;
    const vehicle = await VehicleRepository.findById(id);
    if (!vehicle) {
      throw new NotFoundError('Không tìm thấy xe');
    }
    const updated = await VehicleRepository.update(id, vehicleData);
    if (image) {
      const existingMedia = await prisma.media_files.findFirst({
        where: { entity_type: 'VEHICLE', entity_id: id, is_primary: true }
      });
      if (existingMedia) {
        await prisma.media_files.update({
          where: { id: existingMedia.id },
          data: { file_path: image }
        });
      } else {
        await prisma.media_files.create({
          data: {
            entity_type: 'VEHICLE',
            entity_id: id,
            original_name: 'car.jpg',
            stored_name: 'car.jpg',
            file_path: image,
            is_primary: true,
            storage_provider: 'LOCAL'
          }
        });
      }
    }

    await AuditService.log({
      action: 'UPDATE_VEHICLE',
      entityName: 'vehicles',
      entityId: id,
      newValues: vehicleData,
    });

    return {
      ...updated,
      image: image || 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=600&auto=format&fit=crop&q=60'
    };
  }

  static async deleteVehicle(id: bigint) {
    const vehicle = await VehicleRepository.findById(id);
    if (!vehicle) {
      throw new NotFoundError('Không tìm thấy xe');
    }
    const result = await VehicleRepository.delete(id);

    await AuditService.log({
      action: 'DELETE_VEHICLE',
      entityName: 'vehicles',
      entityId: id,
      newValues: { status: 'INACTIVE' },
    });

    return result;
  }
}
