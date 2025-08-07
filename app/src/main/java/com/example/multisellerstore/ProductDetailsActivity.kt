package com.example.multisellerstore

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.TextView
import com.example.multisellerstore.model.Product

class ProductDetailsActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_product_details)

        val product = intent.getParcelableExtra<Product>("PRODUCT")

        val textViewProductName = findViewById<TextView>(R.id.textViewProductName)
        val textViewProductDescription = findViewById<TextView>(R.id.textViewProductDescription)
        val textViewProductPrice = findViewById<TextView>(R.id.textViewProductPrice)

        product?.let {
            textViewProductName.text = it.name
            textViewProductDescription.text = it.description
            textViewProductPrice.text = "$${it.price}"
        }
    }
}
