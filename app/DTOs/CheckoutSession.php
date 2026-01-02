<?php

namespace App\DTOs;

readonly class CheckoutSession
{
    public function __construct(
        public string $sessionId,
        public string $url,
        public string $status,
        public ?string $customerId = null,
    ) {}
}
