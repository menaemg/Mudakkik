<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\Plan::create([
            'name' => 'Free',
            'price' => 0,
            'features' => 'Feature 1, Feature 2'
        ]);

        \App\Models\Plan::create([
            'name' => 'Premium',
            'price' => 99.99,
            'features' => 'All Free features + Support'
        ]);
    }
}
