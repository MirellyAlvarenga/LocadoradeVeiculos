namespace LocadoraDeVeiculos.DTO_s
{
    public class AluguelDto
    {
        public int IdAluguel { get; set; }
        public DateTime DataRetirada { get; set; }
        public DateTime DataPrevistaDevolucao { get; set; }
        public DateTime? DataDevolucaoReal { get; set; }
        public int QuilometragemInicial { get; set; }
        public int? QuilometragemFinal { get; set; }
        public decimal ValorDiaria { get; set; }
        public decimal? ValorTotal { get; set; }
        public string? StatusAluguel { get; set; }
        public int IdCliente { get; set; }
        public string? NomeCliente { get; set; }
        public string? EmailCliente { get; set; }
        public int IdVeiculo { get; set; }
        public string? ModeloVeiculo { get; set; }
        public string? PlacaVeiculo { get; set; }
        public string? FabricanteVeiculo { get; set; }
    }
}