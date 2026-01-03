<?php

namespace Database\Seeders;

use App\Models\HomeSlot;
use App\Models\Post;
use Illuminate\Database\Seeder;

class HomeSlotsSeeder extends Seeder
{
    public function run(): void
    {
        HomeSlot::truncate();

        $this->seedSection('hero', ['main', 'strip_1', 'strip_2']);

        $this->seedSection('ticker', ['1', '2', '3', '4', '5'], 'news');

        $this->seedSection('featured', ['main', 'sub_1', 'sub_2', 'sub_3', 'sub_4']);

        $this->seedSection('editors_choice', ['1', '2', '3', '4']);

        $this->seedSection('top_stories', ['large_1', 'large_2', 'small_1', 'small_2', 'small_3', 'small_4']);
    }

    private function seedSection($section, $slots, $type = 'article')
    {
        foreach ($slots as $slotName) {
            $post = Post::where('status', 'published')
                ->where('type', $type)
                ->where('ai_verdict', '!=', 'fake')
                ->inRandomOrder()
                ->first();

            if (!$post) {
                 $post = Post::where('status', 'published')
                    ->where('ai_verdict', '!=', 'fake')
                    ->inRandomOrder()
                    ->first();
            }

            HomeSlot::create([
                'section'   => $section,
                'slot_name' => $slotName,
                'post_id'   => $post ? $post->id : null
            ]);
        }
    }
}
