<?php

namespace App\DTOs;

readonly class WebhookResult
{
    public function __construct(
        public bool $success,
        public string $eventType,
        public ?string $message = null,
        public array $data = [],
    ) {}

    public static function success(string $eventType, array $data = [], ?string $message = null): self
    {
        return new self(
            success: true,
            eventType: $eventType,
            message: $message,
            data: $data,
        );
    }

    public static function failure(string $eventType, string $message): self
    {
        return new self(
            success: false,
            eventType: $eventType,
            message: $message,
        );
    }

    public static function ignored(string $eventType): self
    {
        return new self(
            success: true,
            eventType: $eventType,
            message: 'Event ignored',
        );
    }
}
