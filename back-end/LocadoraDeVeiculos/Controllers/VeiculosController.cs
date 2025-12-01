namespace LocadoraDeVeiculos.Controllers;

using LocadoraDeVeiculos.DTO_s;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class VeiculosController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public VeiculosController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetVeiculos()
    {
        var veiculos = await _context.Veiculos
            .Include(v => v.Fabricante)
            .Include(v => v.CategoriaVeiculo)
            .Select(v => new VeiculoDto
            {
                IdVeiculo = v.IdVeiculo,
                Modelo = v.Modelo,
                AnoFabricacao = v.AnoFabricacao,
                QuilometragemAtual = v.QuilometragemAtual,
                Placa = v.Placa,
                Cor = v.Cor,
                Disponivel = v.Disponivel,
                FabricanteNome = v.Fabricante.Nome,
                CategoriaNome = v.CategoriaVeiculo.Nome
            })
            .ToListAsync();

        return Ok(veiculos);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetVeiculo(int id)
    {
        var veiculo = await _context.Veiculos
            .Include(v => v.Fabricante)
            .Include(v => v.CategoriaVeiculo)
            .Where(v => v.IdVeiculo == id)
            .Select(v => new VeiculoDto
            {
                IdVeiculo = v.IdVeiculo,
                Modelo = v.Modelo,
                AnoFabricacao = v.AnoFabricacao,
                QuilometragemAtual = v.QuilometragemAtual,
                Placa = v.Placa,
                Cor = v.Cor,
                Disponivel = v.Disponivel,
                FabricanteNome = v.Fabricante.Nome,
                CategoriaNome = v.CategoriaVeiculo.Nome
            })
            .FirstOrDefaultAsync();

        if (veiculo == null)
        {
            return NotFound(new { Message = "Veículo não encontrado." });
        }

        return Ok(veiculo);
    }

    [HttpPost]
    public async Task<IActionResult> CreateVeiculo([FromBody] Veiculo veiculo)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        _context.Veiculos.Add(veiculo);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetVeiculo), new { id = veiculo.IdVeiculo }, veiculo);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateVeiculo(int id, [FromBody] Veiculo veiculo)
    {
        if (id != veiculo.IdVeiculo)
        {
            return BadRequest(new { Message = "ID do veículo não corresponde." });
        }

        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var veiculoExistente = await _context.Veiculos
            .Include(v => v.Fabricante)
            .Include(v => v.CategoriaVeiculo)
            .FirstOrDefaultAsync(v => v.IdVeiculo == id);

        if (veiculoExistente == null)
        {
            return NotFound(new { Message = "Veículo não encontrado." });
        }

        var categoriaExistente = await _context.CategoriasVeiculo
            .FirstOrDefaultAsync(c => c.IdCategoria == veiculo.IdCategoria);

        if (categoriaExistente == null)
        {
            return BadRequest(new { Message = "Categoria especificada não encontrada." });
        }

        var fabricanteExistente = await _context.Fabricantes
            .FirstOrDefaultAsync(f => f.IdFabricante == veiculo.IdFabricante);

        if (fabricanteExistente == null)
        {
            return BadRequest(new { Message = "Fabricante especificado não encontrado." });
        }

        veiculoExistente.Modelo = veiculo.Modelo;
        veiculoExistente.AnoFabricacao = veiculo.AnoFabricacao;
        veiculoExistente.QuilometragemAtual = veiculo.QuilometragemAtual;
        veiculoExistente.Placa = veiculo.Placa;
        veiculoExistente.Cor = veiculo.Cor;
        veiculoExistente.Disponivel = veiculo.Disponivel;
        veiculoExistente.IdFabricante = veiculo.IdFabricante;
        veiculoExistente.IdCategoria = veiculo.IdCategoria;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.Veiculos.Any(v => v.IdVeiculo == id))
            {
                return NotFound(new { Message = "Veículo não encontrado." });
            }
            throw;
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteVeiculo(int id)
    {
        var veiculo = await _context.Veiculos.FindAsync(id);
        if (veiculo == null)
        {
            return NotFound(new { Message = "Veículo não encontrado." });
        }

        _context.Veiculos.Remove(veiculo);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpGet("disponiveis/categoria/{idCategoria}")]
    public async Task<IActionResult> GetVeiculosDisponiveisPorCategoria(int idCategoria)
    {
        var veiculos = await _context.Veiculos
            .Where(v => v.Disponivel && v.IdCategoria == idCategoria)
            .Include(v => v.CategoriaVeiculo)
            .Include(v => v.Fabricante)
            .Select(v => new VeiculoDto
            {
                IdVeiculo = v.IdVeiculo,
                Modelo = v.Modelo,
                AnoFabricacao = v.AnoFabricacao,
                QuilometragemAtual = v.QuilometragemAtual,
                Placa = v.Placa,
                Cor = v.Cor,
                Disponivel = v.Disponivel,
                FabricanteNome = v.Fabricante.Nome,
                CategoriaNome = v.CategoriaVeiculo.Nome
            })
            .ToListAsync();

        if (!veiculos.Any())
        {
            return NotFound(new { Message = "Nenhum veículo disponivel para a categoria especificada." });
        }

        return Ok(veiculos);
    }

    [HttpGet("alugados/fabricante/{idFabricante}")]
    public async Task<IActionResult> GetVeiculosAlugadosPorFabricante(int idFabricante)
    {
        var veiculos = await _context.Alugueis
            .Where(a => a.Veiculo.IdFabricante == idFabricante)
            .Include(a => a.Veiculo)
            .ThenInclude(v => v.Fabricante)
            .Include(a => a.Veiculo.CategoriaVeiculo)
            .Select(a => new VeiculoDto
            {
                IdVeiculo = a.Veiculo.IdVeiculo,
                Modelo = a.Veiculo.Modelo,
                AnoFabricacao = a.Veiculo.AnoFabricacao,
                QuilometragemAtual = a.Veiculo.QuilometragemAtual,
                Placa = a.Veiculo.Placa,
                Cor = a.Veiculo.Cor,
                Disponivel = a.Veiculo.Disponivel,
                FabricanteNome = a.Veiculo.Fabricante.Nome,
                CategoriaNome = a.Veiculo.CategoriaVeiculo.Nome
            })
            .Distinct()
            .ToListAsync();

        if (!veiculos.Any())
        {
            return NotFound(new { Message = "Nenhum veículo alugado encontrado para o fabricante especificado." });
        }

        return Ok(veiculos);
    }
}