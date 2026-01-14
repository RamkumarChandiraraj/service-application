using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;

namespace service_application.Server.Hubs
{
    public class ChatHub : Hub
    {
        // 🔑 Store active users (UserId -> ConnectionId)
        private static ConcurrentDictionary<string, string> ActiveUsers
            = new ConcurrentDictionary<string, string>();

        // 🔗 When user connects
        public override async Task OnConnectedAsync()
        {
            var userId = Context.UserIdentifier;

            if (!string.IsNullOrEmpty(userId))
            {
                ActiveUsers[userId] = Context.ConnectionId;
                Console.WriteLine($"User connected: {userId}");
            }

            // Send active users list to all clients
            await Clients.All.SendAsync("ReceiveUsers", ActiveUsers.Keys);

            await base.OnConnectedAsync();
        }

        // 🔌 When user disconnects
        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var userId = Context.UserIdentifier;

            if (!string.IsNullOrEmpty(userId))
            {
                ActiveUsers.TryRemove(userId, out _);
                Console.WriteLine($"User disconnected: {userId}");
            }

            // Notify all clients
            await Clients.All.SendAsync("ReceiveUsers", ActiveUsers.Keys);

            await base.OnDisconnectedAsync(exception);
        }

        // 💬 Send private message
        public async Task SendMessage(string senderId, string receiverId, string message)
        {
            await Clients.User(receiverId.ToString())
                .SendAsync("ReceiveMessage", new
                {
                    SenderId = senderId,
                    ReceiverId = receiverId,
                    Message = message,
                    SentAt = DateTime.UtcNow
                });
        }
    }
}
