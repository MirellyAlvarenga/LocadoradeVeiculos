using System.ComponentModel.DataAnnotations;
public class Cliente
    {
        [Key]
        public int IdCliente { get; set; }

        [Required(ErrorMessage = "O nome do cliente é obrigatório.")]
        [StringLength(200)]
        public string? Nome { get; set; }

        [Required(ErrorMessage = "O CPF do cliente é obrigatório.")]
        [StringLength(11)] 
        public string? CPF { get; set; }

        [Required(ErrorMessage = "O e-mail do cliente é obrigatório.")]
        [EmailAddress]
        [StringLength(150)]
        public string? Email { get; set; }

        [StringLength(15)]
        public string? Telefone { get; set; }
        public DateTime DataNascimento { get; set; }
        public ICollection<Aluguel> Alugueis { get; set; } = new List<Aluguel>();
    }