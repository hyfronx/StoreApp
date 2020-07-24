using System.Collections.Generic;

namespace Store.Domain
{
    public class Costumer
    {
        public int Id { get; set; }

        public string CNPJ { get; set; }

        public string CompanyName { get; set; }

        public List<Order> Orders { get; set; }
    }
}