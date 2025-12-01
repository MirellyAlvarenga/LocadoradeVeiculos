using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
    public class Veiculo
    {
        [Key]
        public int IdVeiculo { get; set; }

        [Required]
        [StringLength(100)]
        public string? Modelo { get; set; }

        public int AnoFabricacao { get; set; }

        public int QuilometragemAtual { get; set; }

        [Required]
        [StringLength(10)]
        public string? Placa { get; set; }

        [StringLength(50)]
        public string? Cor { get; set; }

        public bool Disponivel { get; set; } = true;

    [ForeignKey("Fabricante")]
    public int IdFabricante { get; set; }
    public Fabricante? Fabricante { get; set; } 

    [ForeignKey("CategoriaVeiculo")]
    public int IdCategoria { get; set; }
    public CategoriaVeiculo? CategoriaVeiculo { get; set; } 
    public ICollection<Aluguel> Alugueis { get; set; } = new List<Aluguel>();
    }
