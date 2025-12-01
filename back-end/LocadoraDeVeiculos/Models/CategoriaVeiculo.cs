using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
public class CategoriaVeiculo
    {
        [Key]
        public int IdCategoria { get; set; }

        [Required(ErrorMessage = "O nome da categoria é obrigatório.")]
        [StringLength(100)]
        public string? Nome { get; set; }

        [StringLength(255)]
        public string? Descricao { get; set; }

        [Required(ErrorMessage = "O valor da diária base é obrigatório.")]
        [Column(TypeName = "decimal(18,2)")]
        public decimal ValorDiariaBase { get; set; }

        public ICollection<Veiculo> Veiculos { get; set; } = new List<Veiculo>();
    }
