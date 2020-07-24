namespace Store.Domain
{
    public class OrderProduct
    {
        public int Id { get; set; }

        public int ProductId { get; set; }
        
        public Product Product { get; set; }

        public decimal Quantity { get; set; }

        public decimal SalePrice { get; set; }

        public int OrderId { get; set; }

        public Order Order { get; set; }
    }
}