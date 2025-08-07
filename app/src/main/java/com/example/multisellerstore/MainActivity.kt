package com.example.multisellerstore

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.multisellerstore.adapter.ProductAdapter
import com.example.multisellerstore.model.Product

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val recyclerViewProducts = findViewById<RecyclerView>(R.id.recyclerViewProducts)
        recyclerViewProducts.layoutManager = LinearLayoutManager(this)

        val productList = createDummyProducts()
        val productAdapter = ProductAdapter(productList)
        recyclerViewProducts.adapter = productAdapter
    }

    private fun createDummyProducts(): List<Product> {
        val products = mutableListOf<Product>()
        for (i in 1..20) {
            products.add(
                Product(
                    id = i,
                    name = "Product $i",
                    description = "This is the description for product $i",
                    price = (10 + i * 2).toDouble()
                )
            )
        }
        return products
    }
}
