<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class EntertainmentCategorySeeder extends Seeder
{
    public function run(): void
    {
        Category::updateOrCreate(
            ['slug' => 'entertainment'],
            [
                'name' => 'ترفيه وفنون',
                'description' => 'أخبار الفن والترفيه',
            ]
        );
    }
}
