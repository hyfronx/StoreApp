using System.Collections.Generic;

namespace Store.WebApi.Dtos
{
    public class OrderDto
    {
        public int Id { get; set; }

        public string Date { get; set; }

        public decimal TotalPurchaseAmount { get; set; }
        
        public int CostumerId { get; set; }

        public CostumerDto Costumer { get; set; }

        public string SellerUser { get; set; }

        public List<OrderProductDto> OrderProducts { get; set; }
    }
}