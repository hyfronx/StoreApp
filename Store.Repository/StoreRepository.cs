using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Store.Domain;
using Store.Domain.Identity;

namespace Store.Repository
{
    public class StoreRepository : IStoreRepository
    {
        private readonly StoreContext _context;

        public StoreRepository(StoreContext context)
        {
            _context = context;
        }

        public void Add<T>(T entity) where T : class
        {
            _context.Add(entity);
        }
        public void Update<T>(T entity) where T : class
        {
            _context.Update(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            _context.Remove(entity);
        }

        public async Task<bool> SaveChangesAsync()
        {
            return (await _context.SaveChangesAsync()) > 0;
        }

        // Products
        public async Task<Product[]> GetAllProductsAsync()
        {
            IQueryable<Product> query = _context.Products;

            query = query.OrderBy(p => p.Name);

            return await query.AsNoTracking().ToArrayAsync();
        }

        public async Task<Product> GetProductAsyncById(int productId)
        {
            IQueryable<Product> query = _context.Products;

            query = query.Where(p => p.Id == productId);

            return await query.AsNoTracking().FirstAsync();
        }

        // Costumers
        public async Task<Costumer[]> GetAllCostumersAsync()
        {
            IQueryable<Costumer> query = _context.Costumers;

            query = query.OrderBy(c => c.CompanyName);

            return await query.AsNoTracking().ToArrayAsync();
        }

        public async Task<Costumer> GetCostumerAsyncById(int costumerId)
        {
            IQueryable<Costumer> query = _context.Costumers;

            query = query.Where(c => c.Id == costumerId);

            return await query.AsNoTracking().FirstAsync();
        }

        // Orders
        public async Task<Order[]> GetAllOrdersAsync(bool includeOrderProducts = false)
        {
            IQueryable<Order> query = _context.Orders.OrderByDescending(o => o.Id);

            return await query.AsNoTracking().ToArrayAsync();
        }

        public async Task<Order> GetOrderAsyncById(int orderId, bool includeOrderProducts = false)
        {
            IQueryable<Order> query = _context.Orders
                                              .Include(c => c.Costumer)
                                              .Include(op => op.OrderProducts)
                                                .ThenInclude(p => p.Product)
                                              .Where(p => p.Id == orderId);

            return await query.AsNoTracking().FirstAsync();
        }

        //USER
        public async Task<User[]> GetAllUsersAsync()
        {
            IQueryable<User> query = _context.Users.OrderBy(u => u.UserName);

            return await query.AsNoTracking().ToArrayAsync();
        }
    }
}