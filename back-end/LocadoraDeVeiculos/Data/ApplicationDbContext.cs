using Microsoft.EntityFrameworkCore;
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }
        public DbSet<Fabricante> Fabricantes { get; set; }
        public DbSet<CategoriaVeiculo> CategoriasVeiculo { get; set; }
        public DbSet<Cliente> Clientes { get; set; }
        public DbSet<Veiculo> Veiculos { get; set; }
        public DbSet<Aluguel> Alugueis { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Veiculo>()
                .HasOne(v => v.Fabricante) 
                .WithMany(f => f.Veiculos) 
                .HasForeignKey(v => v.IdFabricante);

            modelBuilder.Entity<Veiculo>()
                .HasOne(v => v.CategoriaVeiculo) 
                .WithMany(c => c.Veiculos) 
                .HasForeignKey(v => v.IdCategoria); 

            modelBuilder.Entity<Aluguel>()
                .HasOne(a => a.Cliente) 
                .WithMany(c => c.Alugueis) 
                .HasForeignKey(a => a.IdCliente);

            modelBuilder.Entity<Aluguel>()
                .HasOne(a => a.Veiculo) 
                .WithMany(v => v.Alugueis) 
                .HasForeignKey(a => a.IdVeiculo); 
        }
    }