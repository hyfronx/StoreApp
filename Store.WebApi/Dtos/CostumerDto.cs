using System.Collections.Generic;

namespace Store.WebApi.Dtos
{
    public class CostumerDto
    {
        public int Id { get; set; }

        public string CNPJ { get; set; }

        public string CompanyName { get; set; }

        public List<OrderDto> Orders { get; set; }
    }
}