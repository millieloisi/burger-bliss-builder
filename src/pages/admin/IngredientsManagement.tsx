import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { Pencil, Trash2, Plus } from 'lucide-react'
import Navigation from '@/components/Navigation'

const IngredientsManagement: React.FC = () => {
  const { t } = useTranslation()
  const [ingredients, setIngredients] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingIngredient, setEditingIngredient] = useState<any | null>(null)
  const [formData, setFormData] = useState({ nombre: '', precio_extra: '', disponible: true })

  useEffect(() => { void fetchIngredients() }, [])

  async function fetchIngredients() {
    setLoading(true)
    try {
      const res = await api.get('/ingredients')
      setIngredients(res.data || [])
    } catch (err: any) {
      toast.error(err?.message || 'Error loading ingredients')
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const ingredientData = {
        nombre: formData.nombre,
        precio_extra: parseInt(String(formData.precio_extra || '0'), 10),
        disponible: !!formData.disponible,
      }

      if (editingIngredient) {
        await api.put(`/ingredients/${editingIngredient.id}`, ingredientData)
      } else {
        await api.post('/ingredients', ingredientData)
      }

      toast.success('Saved')
      setIsDialogOpen(false)
      resetForm()
      fetchIngredients()
    } catch (err: any) {
      toast.error(err?.message || 'Error saving ingredient')
    } finally {
      setLoading(false)
    }
  }

  function handleEdit(ingredient: any) {
    setEditingIngredient(ingredient)
    setFormData({ nombre: ingredient.nombre || '', precio_extra: String(ingredient.precio_extra || ''), disponible: !!ingredient.disponible })
    setIsDialogOpen(true)
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete ingredient?')) return
    try { await api.delete(`/ingredients/${id}`); toast.success('Deleted'); fetchIngredients() } catch (err: any) { toast.error(err?.message || 'Error deleting ingredient') }
  }

  function resetForm() { setFormData({ nombre: '', precio_extra: '', disponible: true }); setEditingIngredient(null) }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{t('admin.ingredients')}</h1>
          <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm() }}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-2 h-4 w-4"/>Add Ingredient</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{editingIngredient ? 'Edit Ingredient' : 'Create Ingredient'}</DialogTitle></DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2"><Label htmlFor="nombre">Name</Label><Input id="nombre" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} required /></div>
                <div className="space-y-2"><Label htmlFor="precio_extra">Extra Price</Label><Input id="precio_extra" type="number" min="0" value={formData.precio_extra} onChange={(e) => setFormData({ ...formData, precio_extra: e.target.value })} required /></div>
                <div className="flex items-center space-x-2"><input type="checkbox" id="disponible" checked={formData.disponible} onChange={(e) => setFormData({ ...formData, disponible: e.target.checked })} className="h-4 w-4"/><Label htmlFor="disponible">Available</Label></div>
                <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Saving...' : editingIngredient ? 'Update Ingredient' : 'Create Ingredient'}</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ingredients.map((ingredient) => (
            <Card key={ingredient.id}><CardHeader><CardTitle className="flex justify-between items-start"><span>{ingredient.nombre}</span><span className="text-primary font-bold">+${ingredient.precio_extra}</span></CardTitle></CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground mb-4">{ingredient.disponible ? 'Available' : 'Unavailable'}</p>
                <div className="flex gap-2"><Button variant="outline" size="sm" onClick={() => handleEdit(ingredient)}><Pencil className="h-4 w-4"/></Button><Button variant="destructive" size="sm" onClick={() => handleDelete(ingredient.id)}><Trash2 className="h-4 w-4"/></Button></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default IngredientsManagement
