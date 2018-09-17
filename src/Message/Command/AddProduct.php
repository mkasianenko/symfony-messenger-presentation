<?php

declare(strict_types=1);

namespace App\Message\Command;

use App\Entity\Product;

class AddProduct
{
    /** @var string */
    private $id;

    /** @var string */
    private $sku;

    /** @var float */
    private $price;

    /** @var string */
    private $name;

    /** @var string */
    private $description;

    public function __construct(
        string $id,
        string $sku,
        float $price,
        string $name,
        string $description = null
    ){
        $this->id = $id;
        $this->sku = $sku;
        $this->price = $price;
        $this->name = $name;
        $this->description = $description;
    }

    public static function fromProduct(Product $product): self
    {
        return new self(
            $product->getId(),
            $product->getSku(),
            $product->getPrice(),
            $product->getName(),
            $product->getDescription()
        );
    }

    public function getId(): string
    {
        return $this->id;
    }

    public function getSku(): string
    {
        return $this->sku;
    }

    public function getPrice(): float
    {
        return $this->price;
    }

    public function getName(): string
    {
        return $this->name;
    }
}
