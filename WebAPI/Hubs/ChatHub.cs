using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace WebAPI.Hubs
{
    public class ChatHub : Hub
    {
        public async Task SendMessage(string user, string message) 
            => await this.Clients.All.SendAsync(Events.MessageReceived, user, message);
    }
}
