﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PriceCalculation.Data.Models
{
    public class Price
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public PriceType Type { get; set; }

        [Required]
        public double Amount { get; set; }

        [Required]
        public int BusinessItemId { get; set; }
        public BusinessItem BusinessItem { get; set; }
    }
}
