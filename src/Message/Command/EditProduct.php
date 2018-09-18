<?php

declare(strict_types=1);

namespace App\Message\Command;

class EditProduct
{
    /** @var string */
    private $id;

    /** @var string */
    private $sku;

    /** @var float */
    private $price;

    /** @var string */
    private $name;

    /** @var string|null */
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

    public function getDescription(): ?string
    {
        return $this->description;
    }
}
