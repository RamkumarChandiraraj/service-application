using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;

namespace service_application.Server.Hubs
{
    public class ChatHub : Hub
    {
        // 🔗 When client connects
        public override async Task OnConnectedAsync()
        {
            var userId = Context.GetHttpContext()?.Request.Query["userId"];

            if (!string.IsNullOrEmpty(userId))
            {
                Context.Items["UserId"] = userId.ToString();
                Console.WriteLine($"User connected: {userId}");
            }

            await Clients.All
                .SendAsync("ReceiveUsers", Context.Items);

            await base.OnConnectedAsync();
        }

        // 🔌 When client disconnects (STOP PROCESS)
        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var userId = Context.Items["UserId"]?.ToString();

            Console.WriteLine($"User disconnected: {userId}");

            await base.OnDisconnectedAsync(exception);
        }



        public IDictionary<object,object> ReceiveUsers()
        {
            var users = Context.Items;

            return users;
        }


        // 💬 Send message to a specific user
        public async Task SendMessage(long senderId, long receiverId, string message)
        {

            var users = Context.Items;

            await Clients.All
                .SendAsync("ReceiveUsers", Context.Items);

            await Clients.User(receiverId.ToString())
                .SendAsync("ReceiveMessage", new
                {
                    SenderId = senderId,
                    ReceiverId = receiverId,
                    Message = message,
                    SentAt = DateTime.UtcNow
                });

            //await Clients.

            //await Clients.User(receiverId.ToString())
            //   .SendAsync("ReceiveMessage", message);
        }
    }
}
