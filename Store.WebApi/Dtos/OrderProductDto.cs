namespace Store.WebApi.Dtos
{
    public class OrderProductDto
    {
        public int ProductId { get; set; }

        public ProductDto Product { get; set; }

        public decimal Quantity { get; set; }

        public decimal SalePrice { get; set; }
    }
}