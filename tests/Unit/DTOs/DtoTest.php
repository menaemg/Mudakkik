<?php

namespace Tests\Unit\DTOs;

use App\DTOs\CheckoutSession;
use App\DTOs\SessionData;
use App\DTOs\WebhookResult;
use PHPUnit\Framework\TestCase;

class DtoTest extends TestCase
{
    public function test_webhook_result_dto_works_correctly(): void
    {
        $success = WebhookResult::success('checkout.session.completed', ['key' => 'value']);
        $this->assertTrue($success->success);
        $this->assertEquals('checkout.session.completed', $success->eventType);
        $this->assertEquals(['key' => 'value'], $success->data);

        $failure = WebhookResult::failure('error', 'Something went wrong');
        $this->assertFalse($failure->success);
        $this->assertEquals('Something went wrong', $failure->message);

        $ignored = WebhookResult::ignored('unknown.event');
        $this->assertTrue($ignored->success);
        $this->assertEquals('Event ignored', $ignored->message);
    }

    public function test_checkout_session_dto_works_correctly(): void
    {
        $session = new CheckoutSession(
            sessionId: 'cs_test_123',
            url: 'https://checkout.stripe.com/test',
            status: 'open',
            customerId: 'cus_123',
        );

        $this->assertEquals('cs_test_123', $session->sessionId);
        $this->assertEquals('https://checkout.stripe.com/test', $session->url);
        $this->assertEquals('open', $session->status);
        $this->assertEquals('cus_123', $session->customerId);
    }

    public function test_session_data_dto_works_correctly(): void
    {
        $data = new SessionData(
            sessionId: 'cs_test_123',
            status: 'complete',
            paymentStatus: 'paid',
            customerId: 'cus_123',
            customerEmail: 'test@example.com',
            subscriptionId: 'sub_123',
            amountTotal: 1999,
            currency: 'usd',
            metadata: ['user_id' => '1'],
        );

        $this->assertEquals('cs_test_123', $data->sessionId);
        $this->assertEquals('paid', $data->paymentStatus);
        $this->assertEquals(1999, $data->amountTotal);
        $this->assertEquals(['user_id' => '1'], $data->metadata);
    }
}
