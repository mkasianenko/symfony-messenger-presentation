<?php

declare(strict_types=1);

namespace App\Entity\EntityListener;

use App\Entity\Product;
use Ramsey\Uuid\UuidFactoryInterface;

class ProductEntityListener
{
    /** @var UuidFactoryInterface */
    private $uuidFactory;

    public function __construct(UuidFactoryInterface $uuidFactory)
    {
        $this->uuidFactory = $uuidFactory;
    }

    public function prePersist(Product $product)
    {
        if (null === $product->getId()) {
            $uuid = $this->uuidFactory->uuid4()->toString();
            $product->setId($uuid);
        }
    }
}
