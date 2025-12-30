using Common.Extension;
using Common.RequestDto;
using Data.Base;
using Data.Entities;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Ocsp;
using Services.Interface;

namespace Services.Impl
{
    public class ServiceService(IRepositary<Service> serviceRepository) : IServiceService
    {
        private readonly IRepositary<Service> _serviceRespository = serviceRepository;

        

        public async ValueTask<Service> CreateServiceAsync(ServiceRequestDto req)
        {
            try
            {
                var entity = req.ToMap<ServiceRequestDto, Service>();

                entity.GenerateCreateHistory(1);
                await _serviceRespository.CreateAsync(entity);
                return entity;

            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public async ValueTask<Service> GetServiceById(long id)
        {
            try
            {
                var service = await ValueTask.FromResult(_serviceRespository.FindByCondition(x => x.ID == id).Include(x => x.Category).FirstOrDefault());
                if (service == null)
                {
                    throw new InvalidDataException($"Id '{id}' not exists.");
                }
                return service;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async ValueTask UpdateServiceByIdAsync(ServiceRequestDto req)
        {
            try
            {
                var oldEntity = await _serviceRespository.FindByCondition(s => s.ID == req.ID).FirstOrDefaultAsync();

                oldEntity.Name = req.Name;
                oldEntity.Description = req.Description;
                oldEntity.CategoryId = req.CategoryId;

                oldEntity.GenerateModifyHistory(1);
                await _serviceRespository.UpdateAsync(oldEntity);

            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async ValueTask DeleteServiceById(long id)
        {
            try
            {
                var oldEntity = await _serviceRespository.FindByCondition(s => s.ID == id).FirstOrDefaultAsync();

                oldEntity.GenerateDeleteHistory(1);
                await _serviceRespository.DeleteAsync(oldEntity);

            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async ValueTask<List<Service>> GetAllService()
        {
            try
            {
                var services = await ValueTask.FromResult(_serviceRespository.FindAll().Include(x => x.Category).ToList());
                return services;
            }
            catch (Exception ex)
            {
                throw;
            }
        }
    }
}
