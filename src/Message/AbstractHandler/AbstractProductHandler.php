<?php

declare(strict_types=1);

namespace App\Message\AbstractHandler;

use App\Entity\Product;
use Doctrine\Common\Persistence\ManagerRegistry;
use Doctrine\Common\Persistence\ObjectManager;
use Doctrine\Common\Persistence\ObjectRepository;

abstract class AbstractProductHandler
{
    /** @var ManagerRegistry */
    private $doctrine;

    public function __construct(ManagerRegistry $doctrine)
    {
        $this->doctrine = $doctrine;
    }

    protected function getProductRepository(): ObjectRepository
    {
        return $this->doctrine->getRepository(Product::class);
    }

    protected function getProductManager(): ObjectManager
    {
        if (null === $productManager = $this->doctrine->getManagerForClass(Product::class)) {
            throw new \LogicException(sprintf('Manager for class %s not found', Product::class));
        }

        return $productManager;
    }
}
