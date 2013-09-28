class AddImageIdToOperatingSystem < ActiveRecord::Migration
  def change
    add_column :operating_systems, :image_id, :string
  end
end
