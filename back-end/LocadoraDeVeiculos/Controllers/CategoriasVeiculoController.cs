namespace LocadoraDeVeiculos.Controllers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class CategoriasVeiculoController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public CategoriasVeiculoController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetCategoriasVeiculo()
    {
        var categorias = await _context.CategoriasVeiculo.ToListAsync();
        return Ok(categorias);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetCategoriaVeiculo(int id)
    {
        var categoria = await _context.CategoriasVeiculo.FindAsync(id);
        if (categoria == null)
        {
            return NotFound(new { Message = "Categoria de veículo não encontrada." });
        }
        return Ok(categoria);
    }

    [HttpPost]
    public async Task<IActionResult> CreateCategoriaVeiculo([FromBody] CategoriaVeiculo categoria)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        _context.CategoriasVeiculo.Add(categoria);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetCategoriaVeiculo), new { id = categoria.IdCategoria }, categoria);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCategoriaVeiculo(int id, [FromBody] CategoriaVeiculo categoria)
    {
        if (id != categoria.IdCategoria)
        {
            return BadRequest(new { Message = "ID da categoria não corresponde." });
        }

        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        _context.Entry(categoria).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.CategoriasVeiculo.Any(c => c.IdCategoria == id))
            {
                return NotFound(new { Message = "Categoria de veículo não encontrada." });
            }
            throw;
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCategoriaVeiculo(int id)
    {
        var categoria = await _context.CategoriasVeiculo.FindAsync(id);
        if (categoria == null)
        {
            return NotFound(new { Message = "Categoria de veículo não encontrada." });
        }

        _context.CategoriasVeiculo.Remove(categoria);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}