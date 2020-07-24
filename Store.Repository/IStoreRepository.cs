using System.Threading.Tasks;
using Store.Domain;
using Store.Domain.Identity;

namespace Store.Repository
{
    public interface IStoreRepository
    {
        void Add<T>(T entity) where T: class;
        void Update<T>(T entity) where T: class;
        void Delete<T>(T entity) where T: class;

        Task<bool> SaveChangesAsync();       

        // Products
        Task<Product[]> GetAllProductsAsync();
        Task<Product> GetProductAsyncById(int productId);

        // Costumers
        Task<Costumer[]> GetAllCostumersAsync();
        Task<Costumer> GetCostumerAsyncById(int costumerId);

        // Orders
        Task<Order[]> GetAllOrdersAsync(bool includeOrderProducts = false);
        Task<Order> GetOrderAsyncById(int orderId, bool includeOrderProducts = false);

        Task<User[]> GetAllUsersAsync();
    }
}