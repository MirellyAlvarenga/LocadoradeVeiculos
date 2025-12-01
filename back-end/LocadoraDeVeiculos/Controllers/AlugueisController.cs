namespace LocadoraDeVeiculos.Controllers;

using LocadoraDeVeiculos.DTO_s;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class AlugueisController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AlugueisController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAlugueis()
    {
        var alugueis = await _context.Alugueis
            .Include(a => a.Cliente)
            .Include(a => a.Veiculo)
            .ThenInclude(v => v.Fabricante)
            .Select(a => new AluguelDto
            {
                IdAluguel = a.IdAluguel,
                DataRetirada = a.DataRetirada,
                DataPrevistaDevolucao = a.DataPrevistaDevolucao,
                DataDevolucaoReal = a.DataDevolucaoReal,
                QuilometragemInicial = a.QuilometragemInicial,
                QuilometragemFinal = a.QuilometragemFinal,
                ValorDiaria = a.ValorDiaria,
                ValorTotal = a.ValorTotal,
                StatusAluguel = a.StatusAluguel,
                IdCliente = a.IdCliente,
                NomeCliente = a.Cliente.Nome,
                EmailCliente = a.Cliente.Email,
                IdVeiculo = a.IdVeiculo,
                ModeloVeiculo = a.Veiculo.Modelo,
                PlacaVeiculo = a.Veiculo.Placa,
                FabricanteVeiculo = a.Veiculo.Fabricante.Nome
            })
            .ToListAsync();

        return Ok(alugueis);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetAluguel(int id)
    {
        var aluguel = await _context.Alugueis
            .Include(a => a.Cliente)
            .Include(a => a.Veiculo)
            .ThenInclude(v => v.Fabricante)
            .Select(a => new AluguelDto
            {
                IdAluguel = a.IdAluguel,
                DataRetirada = a.DataRetirada,
                DataPrevistaDevolucao = a.DataPrevistaDevolucao,
                DataDevolucaoReal = a.DataDevolucaoReal,
                QuilometragemInicial = a.QuilometragemInicial,
                QuilometragemFinal = a.QuilometragemFinal,
                ValorDiaria = a.ValorDiaria,
                ValorTotal = a.ValorTotal,
                StatusAluguel = a.StatusAluguel,
                IdCliente = a.IdCliente,
                NomeCliente = a.Cliente.Nome,
                EmailCliente = a.Cliente.Email,
                IdVeiculo = a.IdVeiculo,
                ModeloVeiculo = a.Veiculo.Modelo,
                PlacaVeiculo = a.Veiculo.Placa,
                FabricanteVeiculo = a.Veiculo.Fabricante.Nome
            })
            .FirstOrDefaultAsync(a => a.IdAluguel == id);

        if (aluguel == null)
        {
            return NotFound(new { Message = "Aluguel não encontrado." });
        }

        return Ok(aluguel);
    }

    [HttpPost]
    public async Task<IActionResult> CreateAluguel([FromBody] Aluguel aluguel)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var cliente = await _context.Clientes.FindAsync(aluguel.IdCliente);
        if (cliente == null)
        {
            return BadRequest(new { Message = "Cliente não encontrado." });
        }

        var veiculo = await _context.Veiculos
          .Include(v => v.Fabricante)
          .FirstOrDefaultAsync(v => v.IdVeiculo == aluguel.IdVeiculo);
        if (veiculo == null)
        {
            return BadRequest(new { Message = "Veículo não encontrado." });
        }

        aluguel.Cliente = cliente;
        aluguel.Veiculo = veiculo;

        _context.Alugueis.Add(aluguel);
        await _context.SaveChangesAsync();

        var aluguelDto = new AluguelDto
        {
            IdAluguel = aluguel.IdAluguel,
            DataRetirada = aluguel.DataRetirada,
            DataPrevistaDevolucao = aluguel.DataPrevistaDevolucao,
            DataDevolucaoReal = aluguel.DataDevolucaoReal,
            QuilometragemInicial = aluguel.QuilometragemInicial,
            QuilometragemFinal = aluguel.QuilometragemFinal,
            ValorDiaria = aluguel.ValorDiaria,
            ValorTotal = aluguel.ValorTotal,
            StatusAluguel = aluguel.StatusAluguel,
            IdCliente = aluguel.IdCliente,
            NomeCliente = cliente.Nome,
            EmailCliente = cliente.Email,
            IdVeiculo = aluguel.IdVeiculo,
            ModeloVeiculo = veiculo.Modelo,
            PlacaVeiculo = veiculo.Placa,
            FabricanteVeiculo = veiculo.Fabricante.Nome
        };

        return CreatedAtAction(nameof(GetAluguel), new { id = aluguel.IdAluguel }, aluguelDto);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateAluguel(int id, [FromBody] Aluguel aluguel)
    {
        if (id != aluguel.IdAluguel)
        {
            return BadRequest(new { Message = "ID do aluguel não corresponde." });
        }

        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        _context.Entry(aluguel).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.Alugueis.Any(a => a.IdAluguel == id))
            {
                return NotFound(new { Message = "Aluguel não encontrado." });
            }
            throw;
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAluguel(int id)
    {
        var aluguel = await _context.Alugueis.FindAsync(id);
        if (aluguel == null)
        {
            return NotFound(new { Message = "Aluguel não encontrado." });
        }

        _context.Alugueis.Remove(aluguel);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpGet("ativos/cliente/{idCliente}")]
    public async Task<IActionResult> GetAlugueisAtivosPorCliente(int idCliente)
    {
        var alugueis = await _context.Alugueis
            .Where(a => a.IdCliente == idCliente && a.DataDevolucaoReal == null)
            .Include(a => a.Cliente)
            .Include(a => a.Veiculo)
            .ThenInclude(v => v.Fabricante)
            .Select(a => new AluguelDto
            {
                IdAluguel = a.IdAluguel,
                DataRetirada = a.DataRetirada,
                DataPrevistaDevolucao = a.DataPrevistaDevolucao,
                QuilometragemInicial = a.QuilometragemInicial,
                ValorDiaria = a.ValorDiaria,
                IdCliente = a.IdCliente,
                NomeCliente = a.Cliente.Nome,
                EmailCliente = a.Cliente.Email,
                IdVeiculo = a.IdVeiculo,
                ModeloVeiculo = a.Veiculo.Modelo,
                PlacaVeiculo = a.Veiculo.Placa,
                FabricanteVeiculo = a.Veiculo.Fabricante.Nome
            })
            .ToListAsync();

        if (!alugueis.Any())
        {
            return NotFound(new { Message = "Nenhum aluguel ativo encontrado para o cliente especificado." });
        }

        return Ok(alugueis);
    }

    [HttpGet("periodo")]
public async Task<IActionResult> GetAlugueisPorPeriodo([FromQuery] DateTime inicio, [FromQuery] DateTime fim)
{
 var alugueis = await _context.Alugueis
     .Where(a => a.DataRetirada >= inicio && a.DataRetirada <= fim)
     .Include(a => a.Cliente)
     .Include(a => a.Veiculo)
     .ThenInclude(v => v.Fabricante)
     .Select(a => new AluguelDto
     {
         IdAluguel = a.IdAluguel,
         DataRetirada = a.DataRetirada,
         DataPrevistaDevolucao = a.DataPrevistaDevolucao,
         DataDevolucaoReal = a.DataDevolucaoReal,
         QuilometragemInicial = a.QuilometragemInicial,
         QuilometragemFinal = a.QuilometragemFinal,
         ValorDiaria = a.ValorDiaria,
         ValorTotal = a.ValorTotal,
         StatusAluguel = a.StatusAluguel,
         IdCliente = a.IdCliente,
         NomeCliente = a.Cliente.Nome,
         EmailCliente = a.Cliente.Email,
         IdVeiculo = a.IdVeiculo,
         ModeloVeiculo = a.Veiculo.Modelo,
         PlacaVeiculo = a.Veiculo.Placa,
         FabricanteVeiculo = a.Veiculo.Fabricante.Nome
     })
     .ToListAsync();

 if (!alugueis.Any())
 {
     return NotFound(new { Message = "Nenhum aluguel encontrado no período especificado." });
 }

 return Ok(alugueis);
}
}