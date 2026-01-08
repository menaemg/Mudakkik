<?php

namespace App\Http\Controllers;

use App\Services\HomePageService;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;

class WelcomeController extends Controller
{
    public function index(HomePageService $homeService)
    {

        $ticker        = $homeService->getTickerWithSlots()->pluck('post')->filter()->values();
        $hero          = $homeService->getHeroWithSlots();
        $featured      = $homeService->getFeaturedManual();
        $topStories    = $homeService->getTopStoriesWithSlots();
        $entertainment = $homeService->getEntertainmentWithSlots();
        $business = $homeService->getBusinessWithSlots();
        $gridSection   = $homeService->getGridSection();
        $ads           = $homeService->getAds();
        $topics        = $homeService->getTopics();
        $moreNews      = $homeService->getMoreNews();
        $editorAlerts  = $homeService->getEditorAlertsManual();

        return Inertia::render('Welcome', [
            'canLogin'    => Route::has('login'),
            'canRegister' => Route::has('register'),
            'ticker'        => $ticker,
            'hero'          => $hero,
            'featured'      => $featured,
            'ads'           => $ads,
            'topics'        => $topics->values(),
            'topStories'    => $topStories->values(),
            'entertainment' => $entertainment->values(),
            'business'      => $business->values(),
            'moreNews'      => $moreNews->values(),
            'gridSection'   => $gridSection,
            'editorAlerts'  => $editorAlerts->values(),
        ]);
    }
}
