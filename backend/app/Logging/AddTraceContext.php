<?php

namespace App\Logging;

use Monolog\LogRecord;
use OpenTelemetry\API\Trace\Span;

class AddTraceContext
{
    public function __invoke(LogRecord $record): LogRecord
    {
        $spanContext = Span::getCurrent()->getContext();

        $traceId = $spanContext->isValid() ? $spanContext->getTraceId() : 'unknown';
        $spanId = $spanContext->isValid() ? $spanContext->getSpanId() : 'unknown';

        return $record->with(context: array_merge($record->context, [
            'trace_id' => $traceId,
            'span_id' => $spanId,
        ]));
    }
}
