namespace LocadoraDeVeiculos.Controllers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class FabricantesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public FabricantesController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetFabricantes()
    {
        var fabricantes = await _context.Fabricantes.ToListAsync();
        return Ok(fabricantes);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetFabricante(int id)
    {
        var fabricante = await _context.Fabricantes.FindAsync(id);
        if (fabricante == null)
        {
            return NotFound(new { Message = "Fabricante não encontrado." });
        }
        return Ok(fabricante);
    }

    [HttpPost]
    public async Task<IActionResult> CreateFabricante([FromBody] Fabricante fabricante)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        _context.Fabricantes.Add(fabricante);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetFabricante), new { id = fabricante.IdFabricante }, fabricante);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateFabricante(int id, [FromBody] Fabricante fabricante)
    {
        if (id != fabricante.IdFabricante)
        {
            return BadRequest(new { Message = "ID do fabricante não corresponde." });
        }

        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        _context.Entry(fabricante).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.Fabricantes.Any(f => f.IdFabricante == id))
            {
                return NotFound(new { Message = "Fabricante não encontrado." });
            }
            throw;
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteFabricante(int id)
    {
        var fabricante = await _context.Fabricantes.FindAsync(id);
        if (fabricante == null)
        {
            return NotFound(new { Message = "Fabricante não encontrado." });
        }

        _context.Fabricantes.Remove(fabricante);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}