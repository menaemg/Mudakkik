<?php

namespace App\DTOs;

readonly class SessionData
{
    public function __construct(
        public string $sessionId,
        public string $status,
        public string $paymentStatus,
        public ?string $customerId = null,
        public ?string $customerEmail = null,
        public ?string $subscriptionId = null,
        public ?int $amountTotal = null,
        public ?string $currency = null,
        public array $metadata = [],
    ) {}
}
