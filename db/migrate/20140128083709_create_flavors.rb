class CreateFlavors < ActiveRecord::Migration
  def change
    create_table :flavors do |t|
      t.string :alias
      t.string :name
      t.integer :vcpus
      t.integer :memory_mb
      t.string :flavorid

      t.timestamps
    end
  end
end
