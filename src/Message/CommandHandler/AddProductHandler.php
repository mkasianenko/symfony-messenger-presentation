<?php

declare(strict_types=1);

namespace App\Message\CommandHandler;

use App\Message\Command\AddProduct;

class AddProductHandler
{
    public function __invoke(AddProduct $message)
    {
    }
}
