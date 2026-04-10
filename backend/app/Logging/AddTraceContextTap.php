<?php

namespace App\Logging;

use Illuminate\Log\Logger;
use Monolog\Formatter\JsonFormatter;
use Monolog\Handler\FormattableHandlerInterface;

class AddTraceContextTap
{
    public function __invoke(Logger $logger): void
    {
        $monolog = $logger->getLogger();

        $monolog->pushProcessor(new AddTraceContext());

        foreach ($monolog->getHandlers() as $handler) {
            if ($handler instanceof FormattableHandlerInterface) {
                $handler->setFormatter(new JsonFormatter(
                    JsonFormatter::BATCH_MODE_JSON,
                    true,
                    false,
                    true
                ));
            }
        }
    }
}
