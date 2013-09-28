class CreateOsTypes < ActiveRecord::Migration
  def change
    create_table :os_types do |t|
      t.string :name
      t.string :family
      t.string :desc

      t.timestamps
    end
  end
end
