namespace LocadoraDeVeiculos.DTO_s;
public class VeiculoDto
{
    public int IdVeiculo { get; set; }
    public string? Modelo { get; set; }
    public int AnoFabricacao { get; set; }
    public int QuilometragemAtual { get; set; }
    public string? Placa { get; set; }
    public string? Cor { get; set; }
    public bool Disponivel { get; set; }
    public string? FabricanteNome { get; set; }
    public string? CategoriaNome { get; set; }
}