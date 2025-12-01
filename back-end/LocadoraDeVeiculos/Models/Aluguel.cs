using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
    public class Aluguel
    {
        [Key] 
        public int IdAluguel { get; set; }

        public DateTime DataRetirada { get; set; }
        public DateTime DataPrevistaDevolucao { get; set; }
        public DateTime? DataDevolucaoReal { get; set; }

        public int QuilometragemInicial { get; set; }
        public int? QuilometragemFinal { get; set; } 

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal ValorDiaria { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? ValorTotal { get; set; } 

        [StringLength(50)]
        public string? StatusAluguel { get; set; }

        [ForeignKey("Cliente")]
        public int IdCliente { get; set; }
        public Cliente? Cliente { get; set; } 

        [ForeignKey("Veiculo")]
        public int IdVeiculo { get; set; }
        public Veiculo? Veiculo { get; set; }
    }