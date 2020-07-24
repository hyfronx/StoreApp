using System;
using System.Collections.Generic;
using Store.Domain.Identity;

namespace Store.Domain
{
    public class Order
    {
        public int Id { get; set; }

        public DateTime Date { get; set; }

        public decimal TotalPurchaseAmount { get; set; }

        public int CostumerId { get; set; }

        public Costumer Costumer { get; set; }

        public string SellerUser { get; set; }

        public List<OrderProduct> OrderProducts { get; set; }
    }
}