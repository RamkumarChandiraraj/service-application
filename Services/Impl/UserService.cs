using Common.Extension;
using Common.RequestDto;
using Data.Base;
using Data.Entities;
using Microsoft.EntityFrameworkCore;
using Services.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Impl 
{
    public class UserService:IUserService
    {
        private readonly IRepositary<User> _userRepository;

        public UserService(IRepositary<User> repository)
        {
            _userRepository = repository;
        }

public async Task<bool> IsDuplicateAsync(string email,string username, long mobileNumber, int? currentUserId = null)
    {
        var user = await _userRepository
            .FindByCondition(u =>
                (u.Email == email || u.MobileNumber == mobileNumber ||u.UserName == username ) &&
                (currentUserId == null || u.ID != currentUserId)
            )
            .FirstOrDefaultAsync();

        return user != null;
    }



    public async ValueTask<User> CreateUserAsync(UserRequestDto req)
        {
            try
            {
                var model = req.ToMap<UserRequestDto, User>();

                model.GenerateCreateHistory(1);
                await _userRepository.CreateAsync(model);
                return model;

            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async ValueTask DeleteUserById(long id)
        {
            try
            {
                var delete = await _userRepository.FindByCondition(s => s.ID == id).FirstOrDefaultAsync();

                delete.GenerateDeleteHistory(1);
                await _userRepository.DeleteAsync(delete);

            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public async ValueTask<List<User>> GetAllUser()
        {
            try
            {
                var user = await ValueTask.FromResult(_userRepository.FindAll().ToList());
                return user;
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public async ValueTask<User> GetUserById(long id)
        {
            try
            {
                var service = await ValueTask.FromResult(_userRepository.FindByCondition(x => x.ID == id).FirstOrDefault());
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

        public async ValueTask UpdateUserByIdAsync(UserRequestDto req)
        {
            try
            {
                var oldEntity = await _userRepository.FindByCondition(s => s.ID == req.ID).FirstOrDefaultAsync();

                //oldEntity.UserName = req.UserName;
                
                oldEntity.Email = req.Email;
                oldEntity.MobileNumber = req.MobileNumber;
                oldEntity.Role = req.Role;

                oldEntity.GenerateModifyHistory(1);
                await _userRepository.UpdateAsync(oldEntity);
                

            }
            catch (Exception ex)
            {
                throw;
            }
        }
    }
}
