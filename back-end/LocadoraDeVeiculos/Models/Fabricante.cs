using System.ComponentModel.DataAnnotations;

    public class Fabricante
    {
        [Key]
        public int IdFabricante { get; set; }

        [Required(ErrorMessage = "O nome do fabricante é obrigatório.")]
        [StringLength(100)]
        public string? Nome { get; set; }

        [StringLength(100)]
        public string? PaisOrigem { get; set; }

        public ICollection<Veiculo> Veiculos { get; set; } = new List<Veiculo>();
    }