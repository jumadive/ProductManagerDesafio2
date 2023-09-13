const fs = require('fs')
const path = 'Products.json'

class ProductManager {
	constructor() {
		this.products = []
	}

	async getProducts() {
		try {
			if (fs.existsSync(path)) {
				const productFile = await fs.promises.readFile(path, 'utf-8')
				return JSON.parse(productFile)
			} else {
				return []
			}
		} catch (error) {
				return error
		}
	}

	async addProduct(product) {
		try {
			const { title, description, price, thumbnail, code, stock } = product

			if (!title || !description || !price || !thumbnail || !code || !stock) {
				console.log('Todos los campos son obligatorios')
				return
			}

			const codeExiste = this.products.some(product => product.code === code)
			if (codeExiste) {
				console.log('El código ya está en uso')
				return
			}

			const products = await this.getProducts()
			let id
			!products.length ? id = 1 : id = products[products.length - 1].id + 1
			products.push({ id, ...product })
			await fs.promises.writeFile(path, JSON.stringify(products))
		} catch (error) {
				return error
		}
	}

	async getProductById(id) {
		try {
			const products = await this.getProducts()
			const product = products.find((product) => product.id === id)
			return !product ? 'ERROR: Not Found' : product
		} catch (error) {
				return error
		}
	}

	async deleteProduct(id) {
		try {
			const products = await this.getProducts()
			const productsNew = products.filter(product => product.id !== id)
			await fs.promises.writeFile(path, JSON.stringify(productsNew))
		} catch (error) {
				return error
		}
	}

	async updateProduct(id, product) {
		try {
			const products = await this.getProducts()
			let productUpdated = products.find(product => product.id === id)
			productUpdated = {...product}
			await fs.promises.writeFile(path, JSON.stringify(productUpdated))
		} catch (error) {
				return error
		}
	}
}